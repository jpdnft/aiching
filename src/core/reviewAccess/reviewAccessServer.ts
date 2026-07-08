export type ReviewAccessRequest = {
  code?: unknown;
};

export type ReviewAccessResponse = {
  granted: boolean;
  message: string;
  reviewAccessToken?: string;
};

export class ReviewAccessError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function validateReviewAccessRequest(body: ReviewAccessRequest | null): ReviewAccessResponse {
  if (process.env.REVIEW_ACCESS_ENABLED !== 'true') {
    throw new ReviewAccessError('Reviewer access is not currently enabled.', 403);
  }

  const configuredCode = process.env.REVIEW_ACCESS_CODE?.trim();

  if (!configuredCode) {
    throw new ReviewAccessError('Reviewer access is not configured.', 503);
  }

  if (typeof body?.code !== 'string' || body.code.trim() !== configuredCode) {
    throw new ReviewAccessError('The reviewer access code was not accepted.', 401);
  }

  return {
    granted: true,
    message: 'Reviewer access granted.',
    reviewAccessToken: `review:${body.code.trim()}`,
  };
}
