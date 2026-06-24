import { aiReadingConfig } from './aiReading';

export const reviewAccessConfig = {
  endpointPath: process.env.EXPO_PUBLIC_REVIEW_ACCESS_API_URL || getDefaultReviewAccessEndpoint(),
  grantDurationMs: 72 * 60 * 60 * 1000,
};

function getDefaultReviewAccessEndpoint(): string {
  try {
    const aiReadingUrl = new URL(aiReadingConfig.endpointPath);
    aiReadingUrl.pathname = '/api/review-access';
    aiReadingUrl.search = '';
    aiReadingUrl.hash = '';
    return aiReadingUrl.toString();
  } catch {
    return '/api/review-access';
  }
}
