import AsyncStorage from '@react-native-async-storage/async-storage';

import { CompletedReading } from '@/core/iching/types';
import { getLocalDateKey } from '@/utils/date';

const HISTORY_KEY = 'aiching.readings.history.v1';
const TODAY_KEY = 'aiching.readings.today.v1';

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

export async function getTodaysReading(): Promise<CompletedReading | null> {
  const today = getLocalDateKey();
  const stored = await readJson<CompletedReading | null>(TODAY_KEY, null);

  if (stored?.localDate === today) {
    return stored;
  }

  const history = await getReadingHistory();
  return history.find((reading) => reading.localDate === today) ?? null;
}

export async function saveCompletedReading(reading: CompletedReading): Promise<void> {
  const history = await getReadingHistory();
  const withoutSameDay = history.filter((entry) => entry.localDate !== reading.localDate);
  const nextHistory = [reading, ...withoutSameDay];

  await AsyncStorage.multiSet([
    [TODAY_KEY, JSON.stringify(reading)],
    [HISTORY_KEY, JSON.stringify(nextHistory)],
  ]);
}

export async function hasCompletedReadingToday(): Promise<boolean> {
  return (await getTodaysReading()) !== null;
}
