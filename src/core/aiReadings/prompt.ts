import { aiReadingConfig } from '@/config/aiReading';
import { getChangedHexagramLines, hasChangingLines, isChangingLine } from '@/core/iching/changingLines';
import { getCastLineDescription } from '@/core/iching/generate';
import { getHexagramByNumber } from '@/core/iching/hexagrams';
import { lookupHexagram } from '@/core/iching/lookup';
import { CastLineDetail, Hexagram, HexagramLines } from '@/core/iching/types';

import { AiReadingPersonality } from './personalities';
import { AiReadingThemeMood } from './themeMoods';

export const AI_READING_PREPEND_NOTE = `You are a professional I Ching interpreter with deep knowledge of the ancient Book of Changes, its symbolic structure, and its practical use as a mirror for timing, character, tension, and transformation.

Offer guidance with depth, imagination, and care. Treat the reading as reflective counsel rather than guaranteed prediction. Do not claim certainty about future events, medical outcomes, legal outcomes, financial outcomes, or another person's hidden intent. If the user asks about such matters, translate the question into symbolic guidance about posture, timing, risks, and wise action.

Safety boundary: If the user question expresses self-harm, suicide, intent to harm another person, abuse, exploitation, or requests instructions for illegal or dangerous acts, do not interpret it as an oracle reading and do not provide instructions that could enable harm. Instead, respond briefly and supportively in the same caring voice: acknowledge the seriousness, encourage immediate help from local emergency services or a trusted person when there is imminent danger, and offer grounding next steps. For offensive, hateful, or exploitative questions, refuse the harmful framing and redirect toward non-harmful reflection.

Make the reading feel premium: write a rich, memorable, highly specific interpretation that is long enough to feel substantial, up to about ${aiReadingConfig.maxWords} words. Consider the primary hexagram, the upside-down/reversed aspect, and the opposite/complementary aspect. If the user asked a question, answer it directly through the hexagram without becoming simplistic. If no question was asked, provide a general outlook with emotional, practical, and spiritual dimensions.

Structure the response with short readable sections using plain section titles. End with a concise practical counsel section. As users will not be able to continue the conversation, do not offer any further interaction or ask for follow-up questions.`;

export function buildAiReadingPrompt({
  hexagram,
  lineCastDetails,
  personality,
  question,
  themeMood,
}: {
  hexagram: Hexagram;
  lineCastDetails?: CastLineDetail[];
  personality: AiReadingPersonality;
  question?: string;
  themeMood?: AiReadingThemeMood;
}): string {
  return `${buildPrependNote(personality, themeMood)}

${buildBodyPrompt(hexagram, lineCastDetails)}

${buildQuestionPrompt(question)}`;
}

export function buildPrependNote(
  personality: AiReadingPersonality,
  themeMood?: AiReadingThemeMood,
): string {
  const themeNote = themeMood
    ? `

THEME ATMOSPHERE:
The selected visual theme is ${themeMood.name}. ${themeMood.instruction}
Let this theme influence imagery, pacing, and emotional weather lightly. Do not let it override the oracle personality, and do not mention the theme by name unless it feels natural.`
    : '';

  return `${AI_READING_PREPEND_NOTE}

PERSONALITY NOTE:
${personality.instruction}
Let this personality shape word choice, metaphors, emotional tone, section framing, and practical counsel throughout the entire reading. Keep the voice distinct enough to feel chosen, while still sounding wise, useful, and human.${themeNote}`;
}

function buildBodyPrompt(hexagram: Hexagram, lineCastDetails?: CastLineDetail[]): string {
  const reversed = hexagram.relationships.reversed;
  const opposite = hexagram.relationships.opposite;
  const changingLinesPrompt = buildChangingLinesPrompt(lineCastDetails);

  return `BODY PROMPT:
Interpret this I Ching cast using the following structured source data.

Primary hexagram:
- Number: ${hexagram.number}
- Name: ${hexagram.name}${hexagram.chineseName ? ` (${hexagram.chineseName})` : ''}
- Binary key: ${hexagram.binaryKey}
- Lines, bottom to top: ${hexagram.lines.join(', ')}
- Lower trigram: ${hexagram.lowerTrigram ?? 'unknown'}
- Upper trigram: ${hexagram.upperTrigram ?? 'unknown'}
- Keywords: ${hexagram.keywords.join(', ')}
- Primary tone: ${hexagram.primaryTone.join(', ')}
- Momentum: ${hexagram.momentum.join(', ')}
- Momentum notes: ${hexagram.momentumNotes.join(' ')}
- Support score: ${hexagram.supportScore}
- Caution score: ${hexagram.cautionScore}
- Theme: ${hexagram.theme}
- Basic interpretation: ${hexagram.basicInterpretation}
- Reflection prompt: ${hexagram.reflectionPrompt}

Upside-down / reversed aspect:
- Related hexagram number: ${reversed.number}${reversed.sameAsPrimary ? ' (same as primary)' : ''}
- Theme: ${reversed.theme}
- Reflection: ${reversed.reflection}
- Application prompt: ${reversed.applicationPrompt}

Opposite / complementary aspect:
- Related hexagram number: ${opposite.number}${opposite.sameAsPrimary ? ' (same as primary)' : ''}
- Theme: ${opposite.theme}
- Reflection: ${opposite.reflection}
- Application prompt: ${opposite.applicationPrompt}
${changingLinesPrompt}

Future-facing lenses:
- Traditional: ${hexagram.future?.traditional ?? 'No separate traditional lens provided.'}
- Career: ${hexagram.future?.career ?? 'No separate career lens provided.'}
- Relationship: ${hexagram.future?.relationship ?? 'No separate relationship lens provided.'}
- Creative: ${hexagram.future?.creative ?? 'No separate creative lens provided.'}
- Shadow: ${hexagram.future?.shadow ?? 'No separate shadow lens provided.'}`;
}

function buildChangingLinesPrompt(lineCastDetails?: CastLineDetail[]): string {
  if (!lineCastDetails?.length) {
    return '';
  }

  const orderedDetails = [...lineCastDetails].sort((left, right) => left.position - right.position);
  const lines = orderedDetails.map((detail) => detail.line) as HexagramLines;
  const changingDetails = orderedDetails.filter((detail) => isChangingLine(detail.line));
  const allChanging = changingDetails.length === orderedDetails.length;
  const allUnchanging = changingDetails.length === 0;
  const castingSummary = orderedDetails
    .map((detail) => `- Line ${detail.position}: ${getCastLineDescription(detail)}`)
    .join('\n');

  const specialPatternPrompt = allChanging
    ? `\n\nSpecial line pattern:\n- All six lines are changing. Treat this as a highly dynamic cast: the present pattern is under strong pressure to transform, and the resulting hexagram should be given meaningful attention. Mention this explicitly in the reading.`
    : allUnchanging
      ? `\n\nSpecial line pattern:\n- All six lines are stable, with no changing lines. Treat this as a comparatively settled or self-contained cast: the primary hexagram stands on its own with less emphasis on transition. Mention this explicitly in the reading.`
      : '';

  if (!hasChangingLines(lines)) {
    return `

Casting details:
${castingSummary}${specialPatternPrompt}`;
  }

  const resultingHexagram = lookupHexagram(getChangedHexagramLines(lines));
  const changingLineList = changingDetails.map((detail) => detail.position).join(', ');
  const resultingSourceHexagram = getHexagramByNumber(resultingHexagram.number);

  return `

Casting details:
${castingSummary}

Changing lines aspect:
- Changing line positions, bottom to top: ${changingLineList}
- Related hexagram number: ${resultingSourceHexagram.number}
- Related hexagram name: ${resultingSourceHexagram.name}
- Theme: ${resultingSourceHexagram.theme}
- Reflection: ${resultingSourceHexagram.basicInterpretation}
- Application prompt: Read this related hexagram as the direction of change implied by the moving lines. Let it show how the primary situation may evolve, release pressure, or reveal its next form.${specialPatternPrompt}`;
}

function buildQuestionPrompt(question?: string): string {
  const trimmed = question?.trim();

  if (!trimmed) {
    return 'USER QUESTION:\nThe user did not specify a question. Provide a general premium reading and make clear that it is a broad outlook rather than an answer to a specific question.';
  }

  return `USER QUESTION:
The user asked the following question. Answer it through the hexagram and its related aspects:
"${trimmed}"`;
}
