export const aiReadingConfig = {
  defaultModel: 'gpt-5.4-mini',
  endpointPath: process.env.EXPO_PUBLIC_AI_READING_API_URL || '/api/premium-reading',
  maxWords: 1000,
  reasoningEffort: 'low',
};
