import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { aiReadingPersonalities } from '@/core/aiReadings/personalities';
import { hexagramSummaries } from '@/core/iching/hexagrams';

const DAILY_REMINDERS_STORAGE_KEY = 'aiching.dailyReminders.settings.v1';
const DAILY_REMINDERS_CHANNEL_ID = 'daily-reminders';

export type ReminderWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DailyReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationIds: string[];
  weekdays: ReminderWeekday[];
};

export type DailyReminderPermissionState = 'granted' | 'denied' | 'unsupported';

export const reminderWeekdays: { label: string; shortLabel: string; value: ReminderWeekday }[] = [
  { label: 'Sunday', shortLabel: 'Sun', value: 1 },
  { label: 'Monday', shortLabel: 'Mon', value: 2 },
  { label: 'Tuesday', shortLabel: 'Tue', value: 3 },
  { label: 'Wednesday', shortLabel: 'Wed', value: 4 },
  { label: 'Thursday', shortLabel: 'Thu', value: 5 },
  { label: 'Friday', shortLabel: 'Fri', value: 6 },
  { label: 'Saturday', shortLabel: 'Sat', value: 7 },
];

export const defaultDailyReminderSettings: DailyReminderSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
  notificationIds: [],
  weekdays: [1, 2, 3, 4, 5, 6, 7],
};

export function configureDailyReminderNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function loadDailyReminderSettings(): Promise<DailyReminderSettings> {
  const raw = await AsyncStorage.getItem(DAILY_REMINDERS_STORAGE_KEY);

  if (!raw) {
    return defaultDailyReminderSettings;
  }

  try {
    return normalizeDailyReminderSettings(JSON.parse(raw));
  } catch {
    return defaultDailyReminderSettings;
  }
}

export async function saveDailyReminderSettings(settings: DailyReminderSettings): Promise<void> {
  await AsyncStorage.setItem(DAILY_REMINDERS_STORAGE_KEY, JSON.stringify(normalizeDailyReminderSettings(settings)));
}

export async function disableDailyReminders(): Promise<void> {
  const settings = await loadDailyReminderSettings();
  await cancelStoredDailyReminders(settings.notificationIds);
  await saveDailyReminderSettings({
    ...settings,
    enabled: false,
    notificationIds: [],
  });
}

export async function scheduleDailyReminders(
  settings: DailyReminderSettings,
  premiumEnabled: boolean,
): Promise<{ permissionState: DailyReminderPermissionState; settings: DailyReminderSettings }> {
  const normalizedSettings = normalizeDailyReminderSettings(settings);
  await cancelStoredDailyReminders(normalizedSettings.notificationIds);

  if (!premiumEnabled || !normalizedSettings.enabled) {
    const disabledSettings = {
      ...normalizedSettings,
      enabled: premiumEnabled ? normalizedSettings.enabled : false,
      notificationIds: [],
    };
    await saveDailyReminderSettings(disabledSettings);
    return { permissionState: Platform.OS === 'web' ? 'unsupported' : 'granted', settings: disabledSettings };
  }

  if (Platform.OS === 'web') {
    const webSettings = { ...normalizedSettings, enabled: false, notificationIds: [] };
    await saveDailyReminderSettings(webSettings);
    return { permissionState: 'unsupported', settings: webSettings };
  }

  await ensureDailyReminderChannel();
  const permissions = await requestDailyReminderPermissions();

  if (!permissions.granted) {
    const deniedSettings = { ...normalizedSettings, enabled: false, notificationIds: [] };
    await saveDailyReminderSettings(deniedSettings);
    return { permissionState: 'denied', settings: deniedSettings };
  }

  const notificationIds: string[] = [];

  for (const weekday of normalizedSettings.weekdays) {
    const content = buildDailyReminderContent({
      hour: normalizedSettings.hour,
      minute: normalizedSettings.minute,
      weekday,
    });
    const identifier = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: normalizedSettings.hour,
        minute: normalizedSettings.minute,
        channelId: DAILY_REMINDERS_CHANNEL_ID,
      },
    });

    notificationIds.push(identifier);
  }

  const scheduledSettings = {
    ...normalizedSettings,
    enabled: true,
    notificationIds,
  };
  await saveDailyReminderSettings(scheduledSettings);
  return { permissionState: 'granted', settings: scheduledSettings };
}

export function getReminderSummary(settings: DailyReminderSettings): string {
  const time = formatReminderTime(settings.hour, settings.minute);
  const days =
    settings.weekdays.length === 7
      ? 'Every day'
      : reminderWeekdays
          .filter((weekday) => settings.weekdays.includes(weekday.value))
          .map((weekday) => weekday.shortLabel)
          .join(', ');

  return `${days || 'No days selected'} at ${time}`;
}

export function formatReminderTime(hour: number, minute: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function buildDailyReminderContent({
  hour,
  minute,
  weekday,
}: {
  hour: number;
  minute: number;
  weekday: ReminderWeekday;
}): Notifications.NotificationContentInput {
  const seed = weekday * 97 + hour * 13 + minute;
  const hexagram = hexagramSummaries[seed % hexagramSummaries.length];
  const personality = aiReadingPersonalities[(seed + hexagram.number) % aiReadingPersonalities.length];
  const weekdayName = reminderWeekdays.find((day) => day.value === weekday)?.label ?? 'Today';
  const openers = [
    `${weekdayName}'s oracle is awake.`,
    `The coins are tapping for ${weekdayName}.`,
    `${personality.shortName} has a fresh question for you.`,
    `Hexagram ${hexagram.number} is at the door.`,
    `A small omen has arrived for ${weekdayName}.`,
  ];
  const closers = [
    `Ask the I Ching about ${hexagram.name}.`,
    `Cast a line and see what moves.`,
    `Open the app for one clear signal.`,
    `Let ${hexagram.name} start the conversation.`,
    `Take a minute with the Book of Changes.`,
  ];

  return {
    title: openers[seed % openers.length],
    body: closers[(seed + personality.id.length) % closers.length],
    data: {
      source: 'daily-reminder',
      hexagramNumber: hexagram.number,
      weekday,
    },
    sound: true,
  };
}

async function ensureDailyReminderChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(DAILY_REMINDERS_CHANNEL_ID, {
    name: 'Daily reminders',
    description: 'Optional I Ching consultation reminders.',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#E7C56F',
    vibrationPattern: [0, 180, 120, 180],
  });
}

async function requestDailyReminderPermissions() {
  const existing = await Notifications.getPermissionsAsync();

  if (existing.granted) {
    return existing;
  }

  return Notifications.requestPermissionsAsync();
}

async function cancelStoredDailyReminders(notificationIds: string[]) {
  await Promise.all(
    notificationIds.map((identifier) =>
      Notifications.cancelScheduledNotificationAsync(identifier).catch(() => undefined),
    ),
  );
}

function normalizeDailyReminderSettings(value: Partial<DailyReminderSettings>): DailyReminderSettings {
  const hour = Number.isInteger(value.hour) ? clamp(value.hour ?? 8, 0, 23) : 8;
  const minute = Number.isInteger(value.minute) ? clamp(value.minute ?? 0, 0, 59) : 0;
  const weekdays = Array.from(
    new Set(
      (Array.isArray(value.weekdays) ? value.weekdays : defaultDailyReminderSettings.weekdays).filter(
        isReminderWeekday,
      ),
    ),
  ).sort((left, right) => left - right);

  return {
    enabled: Boolean(value.enabled && weekdays.length > 0),
    hour,
    minute,
    notificationIds: Array.isArray(value.notificationIds)
      ? value.notificationIds.filter((identifier): identifier is string => typeof identifier === 'string')
      : [],
    weekdays,
  };
}

function isReminderWeekday(value: unknown): value is ReminderWeekday {
  return typeof value === 'number' && value >= 1 && value <= 7 && Number.isInteger(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
