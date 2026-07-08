import { getStore } from '@netlify/blobs';

import { usageLimits } from '../../../src/config/usageLimits';

type RevenueCatEntitlement = {
  expires_date?: string | null;
};

type RevenueCatSubscriberResponse = {
  subscriber?: {
    entitlements?: Record<string, RevenueCatEntitlement | undefined>;
  };
};

export type PremiumAccess = {
  appUserId: string;
  source: 'revenuecat' | 'review-access' | 'test-bypass';
};

export class PremiumAccessError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PremiumAccessError';
    this.status = status;
  }
}

type UsageRecord = {
  count: number;
  localDate: string;
  updatedAt: string;
};

const usageStoreName = 'premium-reading-usage';

export async function requirePremiumAccess(request: Request): Promise<PremiumAccess> {
  if (process.env.AI_READING_ENABLED === 'false') {
    throw new PremiumAccessError('Premium AI readings are temporarily unavailable.', 503);
  }

  const bearerToken = getBearerToken(request);

  if (isAllowedTestBypass(bearerToken)) {
    return {
      appUserId: 'test-bypass',
      source: 'test-bypass',
    };
  }

  if (isAllowedReviewAccess(bearerToken)) {
    return {
      appUserId: 'review-access',
      source: 'review-access',
    };
  }

  if (!bearerToken) {
    throw new PremiumAccessError('Premium reading authorization is required.', 401);
  }

  if (!process.env.REVENUECAT_SECRET_API_KEY) {
    throw new PremiumAccessError('RevenueCat server verification is not configured.', 500);
  }

  const entitlementId = process.env.REVENUECAT_ENTITLEMENT_ID || 'premium';
  const isPremium = await verifyRevenueCatEntitlement(bearerToken, entitlementId);

  if (!isPremium) {
    throw new PremiumAccessError('An active Premium subscription is required.', 403);
  }

  return {
    appUserId: bearerToken,
    source: 'revenuecat',
  };
}

export async function enforcePremiumUsageLimits(access: PremiumAccess): Promise<void> {
  const dailyUserLimit = getPositiveIntegerEnv(
    'AI_READING_DAILY_USER_LIMIT',
    usageLimits.premiumDailyAiReadingLimit,
  );
  const globalDailyLimit = getPositiveIntegerEnv('AI_READING_DAILY_GLOBAL_LIMIT', 0);
  const today = getUtcDateKey();

  await incrementDailyUsage(`user/${today}/${toKeySafeId(access.appUserId)}`, dailyUserLimit, 'Daily Premium reading limit reached.');

  if (globalDailyLimit > 0) {
    await incrementDailyUsage(`global/${today}`, globalDailyLimit, 'Daily Premium reading capacity reached.');
  }
}

async function verifyRevenueCatEntitlement(appUserId: string, entitlementId: string): Promise<boolean> {
  const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
    headers: {
      Authorization: `Bearer ${process.env.REVENUECAT_SECRET_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new PremiumAccessError('Unable to verify Premium subscription.', 502);
  }

  const data = (await response.json().catch(() => null)) as RevenueCatSubscriberResponse | null;
  const entitlement = data?.subscriber?.entitlements?.[entitlementId];

  if (!entitlement) {
    return false;
  }

  if (!entitlement.expires_date) {
    return true;
  }

  return Date.parse(entitlement.expires_date) > Date.now();
}

async function incrementDailyUsage(key: string, limit: number, limitMessage: string): Promise<void> {
  const store = getStore({ name: usageStoreName, consistency: 'strong' });
  const existing = (await store.get(key, { type: 'json' }).catch(() => null)) as UsageRecord | null;

  if (existing?.count && existing.count >= limit) {
    throw new PremiumAccessError(limitMessage, 429);
  }

  const nextRecord: UsageRecord = {
    count: (existing?.count ?? 0) + 1,
    localDate: getUtcDateKey(),
    updatedAt: new Date().toISOString(),
  };

  await store.setJSON(key, nextRecord);
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  return token || null;
}

function isAllowedTestBypass(token: string | null): boolean {
  return Boolean(
    token &&
      process.env.ALLOW_AI_READING_TEST_ACCESS === 'true' &&
      process.env.AI_READING_TEST_BYPASS_TOKEN &&
      token === process.env.AI_READING_TEST_BYPASS_TOKEN,
  );
}

function isAllowedReviewAccess(token: string | null): boolean {
  const reviewAccessPrefix = 'review:';

  if (!token?.startsWith(reviewAccessPrefix)) {
    return false;
  }

  const configuredCode = process.env.REVIEW_ACCESS_CODE?.trim();
  const providedCode = token.slice(reviewAccessPrefix.length).trim();

  return Boolean(
    process.env.REVIEW_ACCESS_ENABLED === 'true' &&
      configuredCode &&
      providedCode &&
      providedCode === configuredCode,
  );
}

function getPositiveIntegerEnv(name: string, fallback: number): number {
  const rawValue = Number(process.env[name]);

  if (!Number.isInteger(rawValue) || rawValue < 0) {
    return fallback;
  }

  return rawValue;
}

function getUtcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function toKeySafeId(value: string): string {
  return encodeURIComponent(value).slice(0, 500);
}
