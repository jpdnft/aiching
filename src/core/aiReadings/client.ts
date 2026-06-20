import { aiReadingConfig } from '@/config/aiReading';

export type GeneratePremiumReadingParams = {
  hexagramNumber: number;
  personalityId: string;
  question?: string;
  readingId: string;
  themeId: string;
};

export type GeneratePremiumReadingResult = {
  generatedAt: string;
  model: string;
  personalityId: string;
  personalityName: string;
  text: string;
};

export async function generatePremiumReading(
  params: GeneratePremiumReadingParams,
): Promise<GeneratePremiumReadingResult> {
  const response = await fetch(aiReadingConfig.endpointPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const body = (await response.json().catch(() => null)) as
    | (GeneratePremiumReadingResult & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(body?.error ?? 'Unable to generate the premium reading.');
  }

  if (!body?.text) {
    throw new Error('The premium reading response was empty.');
  }

  return body;
}
