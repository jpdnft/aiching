import { getStore } from '@netlify/blobs';

import { premiumQuestionConfig } from '../../../src/config/premiumQuestion';
import { PremiumReadingRequest } from '../../../src/core/aiReadings/premiumReadingServer';

export type ArchivedPremiumQuestion = {
  createdDate: string;
  question: string;
  schemaVersion: 1;
  source: 'premium-reading';
};

const questionStoreName = 'premium-reading-questions';

export async function archivePremiumQuestion(body: PremiumReadingRequest | null): Promise<void> {
  if (process.env.AI_READING_QUESTION_ARCHIVE_ENABLED !== 'true') {
    return;
  }

  const question = sanitizeQuestion(body?.question);

  if (!question) {
    return;
  }

  const createdDate = getUtcDateKey();
  const store = getQuestionStore();
  const key = `${createdDate}/${crypto.randomUUID()}.json`;

  await store.setJSON(key, {
    createdDate,
    question,
    schemaVersion: 1,
    source: 'premium-reading',
  } satisfies ArchivedPremiumQuestion);
}

export async function listArchivedPremiumQuestions(prefix?: string): Promise<ArchivedPremiumQuestion[]> {
  const store = getQuestionStore();
  const { blobs } = await store.list(prefix ? { prefix } : undefined);
  const questions: ArchivedPremiumQuestion[] = [];

  for (const blob of blobs) {
    const question = (await store.get(blob.key, { type: 'json' }).catch(() => null)) as
      | ArchivedPremiumQuestion
      | null;

    if (question?.question) {
      questions.push(question);
    }
  }

  return questions.sort((left, right) => left.createdDate.localeCompare(right.createdDate));
}

export async function clearArchivedPremiumQuestions(): Promise<number> {
  const store = getQuestionStore();
  const result = await store.deleteAll();

  return result.deletedBlobs;
}

export async function pruneArchivedPremiumQuestions(beforeDate: string): Promise<number> {
  const store = getQuestionStore();
  const { blobs } = await store.list();
  let deletedCount = 0;

  for (const blob of blobs) {
    const datePrefix = blob.key.slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePrefix) && datePrefix < beforeDate) {
      await store.delete(blob.key);
      deletedCount += 1;
    }
  }

  return deletedCount;
}

export function requireQuestionsAdmin(request: Request): void {
  const expectedToken = process.env.ADMIN_QUESTIONS_API_TOKEN;
  const providedToken = getBearerToken(request);

  if (!expectedToken || providedToken !== expectedToken) {
    throw new Error('Unauthorized');
  }
}

function getQuestionStore() {
  return getStore({ name: questionStoreName, consistency: 'strong' });
}

function sanitizeQuestion(question: unknown): string | null {
  if (typeof question !== 'string') {
    return null;
  }

  const trimmed = question.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed
    .slice(0, premiumQuestionConfig.maxLength)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g, '[phone]')
    .replace(/\bhttps?:\/\/\S+/gi, '[url]');
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  return token || null;
}

function getUtcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}
