import { aiReadingConfig } from '@/config/aiReading';
import { CastLineDetail } from '@/core/iching/types';

const internetRequiredMessage = 'Internet connection required here. Please connect and retry.';

export type GeneratePremiumReadingParams = {
  lineCastDetails?: CastLineDetail[];
  hexagramNumber: number;
  personalityId: string;
  premiumAccessToken?: string | null;
  question?: string;
  readingId: string;
  revenueCatAppUserId?: string | null;
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
  let response: Response;
  const premiumAccessToken = params.premiumAccessToken ?? params.revenueCatAppUserId;

  try {
    response = await fetch(aiReadingConfig.endpointPath, {
      method: 'POST',
      headers: {
        ...(premiumAccessToken ? { Authorization: `Bearer ${premiumAccessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hexagramNumber: params.hexagramNumber,
        lineCastDetails: params.lineCastDetails,
        personalityId: params.personalityId,
        question: params.question,
        readingId: params.readingId,
        themeId: params.themeId,
      }),
    });
  } catch {
    throw new Error(internetRequiredMessage);
  }

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
