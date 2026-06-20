import { aiReadingConfig } from '../../config/aiReading';
import { getHexagramByNumber } from '../iching/hexagrams';
import { buildAiReadingPrompt } from './prompt';
import { getAiReadingPersonality } from './personalities';
import { getAiReadingThemeMood } from './themeMoods';

export type PremiumReadingRequest = {
  hexagramNumber?: number;
  personalityId?: string;
  question?: string;
  readingId?: string;
  themeId?: string;
};

type OpenAiTextContent = {
  text?: string;
  type?: string;
};

type OpenAiOutputItem = {
  content?: OpenAiTextContent[];
};

type OpenAiResponse = {
  error?: {
    message?: string;
  };
  output?: OpenAiOutputItem[];
  output_text?: string;
};

export class PremiumReadingError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PremiumReadingError';
    this.status = status;
  }
}

export async function generatePremiumReadingOnServer(body: PremiumReadingRequest | null) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new PremiumReadingError('OPENAI_API_KEY is not configured on the server.', 500);
  }

  if (!body?.hexagramNumber || body.hexagramNumber < 1 || body.hexagramNumber > 64) {
    throw new PremiumReadingError('A valid hexagramNumber from 1 to 64 is required.', 400);
  }

  const question = getValidatedQuestion(body.question);
  const hexagram = getHexagramByNumber(body.hexagramNumber);
  const personality = getAiReadingPersonality(body.personalityId);
  const themeMood = getAiReadingThemeMood(body.themeId);
  const prompt = buildAiReadingPrompt({
    hexagram,
    personality,
    question,
    themeMood,
  });
  const model = process.env.OPENAI_READING_MODEL || aiReadingConfig.defaultModel;
  const reasoningEffort = process.env.OPENAI_READING_REASONING_EFFORT || aiReadingConfig.reasoningEffort;

  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: prompt,
      model,
      reasoning: {
        effort: reasoningEffort,
      },
    }),
  });

  const data = (await openAiResponse.json().catch(() => null)) as OpenAiResponse | null;

  if (!openAiResponse.ok) {
    throw new PremiumReadingError(
      data?.error?.message ?? 'OpenAI could not generate the premium reading.',
      openAiResponse.status,
    );
  }

  const text = extractResponseText(data);

  if (!text) {
    throw new PremiumReadingError('OpenAI returned an empty premium reading.', 502);
  }

  return {
    generatedAt: new Date().toISOString(),
    model,
    personalityId: personality.id,
    personalityName: personality.name,
    text,
  };
}

function getValidatedQuestion(question: unknown): string | undefined {
  if (question === undefined || question === null) {
    return undefined;
  }

  if (typeof question !== 'string') {
    throw new PremiumReadingError('Question must be text.', 400);
  }

  const trimmed = question.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length > 600) {
    throw new PremiumReadingError('Question must be 600 characters or fewer.', 400);
  }

  return trimmed;
}

function extractResponseText(data: OpenAiResponse | null): string {
  if (data?.output_text) {
    return data.output_text.trim();
  }

  return (
    data?.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? '')
      .join('\n')
      .trim() ?? ''
  );
}
