import { reviewAccessConfig } from '@/config/reviewAccess';

export type ReviewAccessResult = {
  granted: boolean;
  message?: string;
  reviewAccessToken?: string;
};

export async function requestReviewAccess(code: string): Promise<ReviewAccessResult> {
  const response = await fetch(reviewAccessConfig.endpointPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const body = (await response.json().catch(() => null)) as ReviewAccessResult | null;

  if (!response.ok) {
    return {
      granted: false,
      message: body?.message ?? 'Reviewer access is unavailable right now.',
    };
  }

  return {
    granted: Boolean(body?.granted),
    message: body?.message,
    reviewAccessToken: body?.reviewAccessToken,
  };
}
