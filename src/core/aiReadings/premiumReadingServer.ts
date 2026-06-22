import { aiReadingConfig } from '../../config/aiReading';
import { getLineStateFromTotal } from '../iching/generate';
import { getHexagramByNumber } from '../iching/hexagrams';
import { lookupHexagram } from '../iching/lookup';
import { CastLineDetail, CastLineTotal, CastValue, HexagramLines } from '../iching/types';
import { buildAiReadingPrompt } from './prompt';
import { getAiReadingPersonality } from './personalities';
import { getAiReadingThemeMood } from './themeMoods';

export type PremiumReadingRequest = {
  hexagramNumber?: number;
  lineCastDetails?: unknown;
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
  const lineCastDetails = getValidatedLineCastDetails(body.lineCastDetails);
  const hexagram = getHexagramByNumber(body.hexagramNumber);

  if (lineCastDetails) {
    const castHexagram = lookupHexagram(lineCastDetails.map((detail) => detail.line) as HexagramLines);

    if (castHexagram.number !== hexagram.number) {
      throw new PremiumReadingError('lineCastDetails do not match the requested hexagramNumber.', 400);
    }
  }

  const personality = getAiReadingPersonality(body.personalityId);
  const themeMood = getAiReadingThemeMood(body.themeId);
  const prompt = buildAiReadingPrompt({
    hexagram,
    lineCastDetails,
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

function getValidatedLineCastDetails(lineCastDetails: unknown): CastLineDetail[] | undefined {
  if (lineCastDetails === undefined || lineCastDetails === null) {
    return undefined;
  }

  if (!Array.isArray(lineCastDetails)) {
    throw new PremiumReadingError('lineCastDetails must be an array.', 400);
  }

  if (lineCastDetails.length !== 6) {
    throw new PremiumReadingError('lineCastDetails must contain six cast lines.', 400);
  }

  const validatedDetails = lineCastDetails
    .map((detail, index) => getValidatedLineCastDetail(detail, index + 1))
    .sort((left, right) => left.position - right.position);

  const positionCount = new Set(validatedDetails.map((detail) => detail.position)).size;

  if (positionCount !== 6) {
    throw new PremiumReadingError('Cast line positions must be unique.', 400);
  }

  return validatedDetails;
}

function getValidatedLineCastDetail(detail: unknown, fallbackPosition: number): CastLineDetail {
  if (!detail || typeof detail !== 'object') {
    throw new PremiumReadingError('Each cast line detail must be an object.', 400);
  }

  const candidate = detail as Record<string, unknown>;
  const position = Number(candidate.position ?? fallbackPosition);
  const values = candidate.values;

  if (!Number.isInteger(position) || position < 1 || position > 6) {
    throw new PremiumReadingError('Cast line positions must be numbered 1 through 6.', 400);
  }

  if (!Array.isArray(values) || values.length !== 3 || !values.every(isCastValue)) {
    throw new PremiumReadingError('Each cast line must include three values of 2 or 3.', 400);
  }

  const castValues = values as [CastValue, CastValue, CastValue];
  const total = (castValues[0] + castValues[1] + castValues[2]) as CastLineTotal;
  const line = getLineStateFromTotal(total);

  return {
    line,
    position,
    total,
    values: castValues,
  };
}

function isCastValue(value: unknown): value is CastValue {
  return value === 2 || value === 3;
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
