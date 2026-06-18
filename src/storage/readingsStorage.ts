import AsyncStorage from '@react-native-async-storage/async-storage';

import { CompletedReading, PremiumReading } from '@/core/iching/types';
import { getLocalDateKey } from '@/utils/date';

const HISTORY_KEY = 'aiching.readings.history.v1';
const TODAY_KEY = 'aiching.readings.today.v1';
const MAX_HISTORY_ENTRIES = 1000;

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
}
