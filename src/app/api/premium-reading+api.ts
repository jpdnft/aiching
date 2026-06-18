import { aiReadingConfig } from '@/config/aiReading';
import { buildAiReadingPrompt } from '@/core/aiReadings/prompt';
import { getAiReadingPersonality } from '@/core/aiReadings/personalities';
import { getHexagramByNumber } from '@/core/iching/hexagrams';

type PremiumReadingRequest = {
  hexagramNumber?: number;
  personalityId?: string;
  question?: string;
  readingId?: string;
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

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return json({ error: 'OPENAI_API_KEY is not configured on the server.' }, 500);
  }

  const body = (await request.json().catch(() => null)) as PremiumReadingRequest | null;

  if (!body?.hexagramNumber || body.hexagramNumber < 1 || body.hexagramNumber > 64) {
    return json({ error: 'A valid hexagramNumber from 1 to 64 is required.' }, 400);
  }

  const hexagram = getHexagramByNumber(body.hexagramNumber);
  const personality = getAiReadingPersonality(body.personalityId);
  const prompt = buildAiReadingPrompt({
    hexagram,
    personality,
    question: body.question,
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
    return json(
      { error: data?.error?.message ?? 'OpenAI could not generate the premium reading.' },
      openAiResponse.status,
    );
  }

  const text = extractResponseText(data);

  if (!text) {
    return json({ error: 'OpenAI returned an empty premium reading.' }, 502);
  }

  return json({
    generatedAt: new Date().toISOString(),
    model,
    personalityId: personality.id,
    personalityName: personality.name,
    text,
  });
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

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
