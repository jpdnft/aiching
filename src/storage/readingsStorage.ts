import AsyncStorage from '@react-native-async-storage/async-storage';

import { CompletedReading, PremiumReading } from '@/core/iching/types';
import { getLocalDateKey } from '@/utils/date';

const HISTORY_KEY = 'aiching.readings.history.v1';
const TODAY_KEY = 'aiching.readings.today.v1';
const DAILY_CAST_USAGE_KEY = 'aiching.readings.dailyCastUsage.v1';
const PREMIUM_DAILY_AI_USAGE_KEY = 'aiching.readings.premiumDailyAiUsage.v1';
const MAX_HISTORY_ENTRIES = 1000;

type DailyCastUsage = {
  count: number;
  localDate: string;
};

type PremiumDailyAiUsage = {
  count: number;
  localDate: string;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getReadingHistory(): Promise<CompletedReading[]> {
  return readJson<CompletedReading[]>(HISTORY_KEY, []);
}

export async function getCurrentReading(): Promise<CompletedReading | null> {
  const today = getLocalDateKey();
  const stored = await readJson<CompletedReading | null>(TODAY_KEY, null);

  if (stored?.localDate === today) {
    return stored;
  }

  return null;
}

export async function getTodaysReading(): Promise<CompletedReading | null> {
  const today = getLocalDateKey();
  const currentReading = await getCurrentReading();

  if (currentReading) {
    return currentReading;
  }

  const history = await getReadingHistory();
  return history.find((reading) => reading.localDate === today) ?? null;
}

export async function saveCompletedReading(reading: CompletedReading): Promise<void> {
  const history = await getReadingHistory();
  const withoutSameReading = history.filter((entry) => entry.id !== reading.id);
  const nextHistory = [reading, ...withoutSameReading].slice(0, MAX_HISTORY_ENTRIES);

  await AsyncStorage.multiSet([
    [TODAY_KEY, JSON.stringify(reading)],
    [HISTORY_KEY, JSON.stringify(nextHistory)],
  ]);
}

export async function saveNewCompletedReading(reading: CompletedReading): Promise<void> {
  await recordDailyCast();
  await saveCompletedReading(reading);
}

export async function getTodaysCastCount(): Promise<number> {
  const today = getLocalDateKey();
  const stored = await readJson<DailyCastUsage | null>(DAILY_CAST_USAGE_KEY, null);

  if (stored?.localDate === today) {
    return stored.count;
  }

  const history = await getReadingHistory();
  return history.filter((reading) => reading.localDate === today).length;
}

export async function getTodaysPremiumAiReadingCount(): Promise<number> {
  const today = getLocalDateKey();
  const stored = await readJson<PremiumDailyAiUsage | null>(PREMIUM_DAILY_AI_USAGE_KEY, null);

  if (stored?.localDate === today) {
    return stored.count;
  }

  return 0;
}

export async function recordPremiumAiReadingRequest(): Promise<number> {
  const today = getLocalDateKey();
  const currentCount = await getTodaysPremiumAiReadingCount();
  const nextCount = currentCount + 1;

  await AsyncStorage.setItem(
    PREMIUM_DAILY_AI_USAGE_KEY,
    JSON.stringify({
      count: nextCount,
      localDate: today,
    }),
  );

  return nextCount;
}

async function recordDailyCast(): Promise<void> {
  const today = getLocalDateKey();
  const currentCount = await getTodaysCastCount();

  await AsyncStorage.setItem(
    DAILY_CAST_USAGE_KEY,
    JSON.stringify({
      count: currentCount + 1,
      localDate: today,
    }),
  );
}

export async function clearReadingHistory(): Promise<void> {
  await AsyncStorage.multiRemove([HISTORY_KEY, TODAY_KEY]);
}

export async function deleteReadingFromHistory(readingId: string): Promise<void> {
  const history = await getReadingHistory();
  const nextHistory = history.filter((reading) => reading.id !== readingId);
  const todayReading = await readJson<CompletedReading | null>(TODAY_KEY, null);
  const updates: [string, string][] = [[HISTORY_KEY, JSON.stringify(nextHistory)]];

  if (todayReading?.id === readingId) {
    await AsyncStorage.removeItem(TODAY_KEY);
  }

  await AsyncStorage.multiSet(updates);
}

export async function savePremiumReadingForToday(premiumReading: PremiumReading): Promise<CompletedReading | null> {
  const currentReading = await getCurrentReading();

  if (!currentReading) {
    return null;
  }

  const updatedReading: CompletedReading = {
    ...currentReading,
    premiumReading,
  };

  await saveCompletedReading(updatedReading);
  return updatedReading;
}

export async function hasCompletedReadingToday(): Promise<boolean> {
  return (await getTodaysReading()) !== null;
}

export async function clearCurrentReading(): Promise<void> {
  await AsyncStorage.removeItem(TODAY_KEY);
}

export async function clearTodaysReadingForDev(): Promise<void> {
  await clearCurrentReading();
  await AsyncStorage.removeItem(DAILY_CAST_USAGE_KEY);
  await AsyncStorage.removeItem(PREMIUM_DAILY_AI_USAGE_KEY);
}
