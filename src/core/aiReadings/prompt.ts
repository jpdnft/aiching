import { aiReadingConfig } from '@/config/aiReading';
import { Hexagram } from '@/core/iching/types';

import { AiReadingPersonality } from './personalities';

export const AI_READING_PREPEND_NOTE = `You are a professional I Ching interpreter with deep knowledge of the ancient Book of Changes, its symbolic structure, and its practical use as a mirror for timing, character, tension, and transformation.

Offer guidance with depth, imagination, and care. Treat the reading as reflective counsel rather than guaranteed prediction. Do not claim certainty about future events, medical outcomes, legal outcomes, financial outcomes, or another person's hidden intent. If the user asks about such matters, translate the question into symbolic guidance about posture, timing, risks, and wise action.

Give the user their money's worth: write a rich, memorable, highly specific interpretation that is long enough to feel premium, up to about ${aiReadingConfig.maxWords} words. Consider the primary hexagram, the upside-down/reversed aspect, and the opposite/complementary aspect. If the user asked a question, answer it directly through the hexagram without becoming simplistic. If no question was asked, provide a general outlook with emotional, practical, and spiritual dimensions.

Structure the response with short readable sections using plain section titles. End with a concise practical counsel section.`;

export function buildAiReadingPrompt({
  hexagram,
  personality,
  question,
}: {
  hexagram: Hexagram;
  personality: AiReadingPersonality;
  question?: string;
}): string {
  return `${buildPrependNote(personality)}

${buildBodyPrompt(hexagram)}

${buildQuestionPrompt(question)}`;
}

export function buildPrependNote(personality: AiReadingPersonality): string {
  return `${AI_READING_PREPEND_NOTE}

PERSONALITY NOTE:
${personality.instruction}`;
}

function buildBodyPrompt(hexagram: Hexagram): string {
  const reversed = hexagram.relationships.reversed;
  const opposite = hexagram.relationships.opposite;

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

Future-facing lenses:
- Traditional: ${hexagram.future?.traditional ?? 'No separate traditional lens provided.'}
- Career: ${hexagram.future?.career ?? 'No separate career lens provided.'}
- Relationship: ${hexagram.future?.relationship ?? 'No separate relationship lens provided.'}
- Creative: ${hexagram.future?.creative ?? 'No separate creative lens provided.'}
- Shadow: ${hexagram.future?.shadow ?? 'No separate shadow lens provided.'}`;
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
