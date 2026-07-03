import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { ScreenContainer } from '@/components/ScreenContainer';
import {
  buildDailyReminderContent,
  DailyReminderPermissionState,
  DailyReminderSettings,
  defaultDailyReminderSettings,
  formatReminderTime,
  getReminderSummary,
  loadDailyReminderSettings,
  reminderWeekdays,
  ReminderWeekday,
  saveDailyReminderSettings,
  scheduleDailyReminders,
} from '@/services/dailyReminders';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const notificationPreviewIcon = require('@/assets/icons/icon.png');
const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minuteOptions = Array.from({ length: 59 }, (_, index) => String(index + 1));
const periodOptions = ['AM', 'PM'];

export default function DailyRemindersScreen() {
  const router = useRouter();
  const { colorMode, entitlements, presentPaywall } = useAppTheme();
  const styles = useDailyReminderStyles();
  const colors = getAiChingColors(colorMode);
  const [settings, setSettings] = useState<DailyReminderSettings>(defaultDailyReminderSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<DailyReminderPermissionState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReminderTime, setSavedReminderTime] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    loadDailyReminderSettings().then((storedSettings) => {
      if (active) {
        setSettings(storedSettings);
        setSavedReminderTime(
          storedSettings.enabled ? formatReminderTime(storedSettings.hour, storedSettings.minute) : null,
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const previewContent = useMemo(
    () =>
      buildDailyReminderContent({
        hour: settings.hour,
        minute: settings.minute,
        weekday: settings.weekdays[0] ?? 1,
      }),
    [settings.hour, settings.minute, settings.weekdays],
  );

  async function handleSave() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const result = await scheduleDailyReminders(settings, entitlements.notificationsEnabled);
      setSettings(result.settings);
      setPermissionState(result.permissionState);

      if (result.permissionState === 'unsupported') {
        setSavedReminderTime(null);
        setMessage('Daily reminders can be configured in the Android app build.');
      } else if (result.permissionState === 'denied') {
        setSavedReminderTime(null);
        setMessage('Notifications are blocked for this app. Enable them in system settings to use reminders.');
      } else if (result.settings.enabled) {
        const savedTime = formatReminderTime(result.settings.hour, result.settings.minute);
        setSavedReminderTime(savedTime);
        setMessage(`Reminder set for ${savedTime}.`);
      } else {
        setSavedReminderTime(null);
        setMessage('Daily reminders are off.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLocalSave(nextSettings: DailyReminderSettings) {
    setSettings(nextSettings);

    if (!nextSettings.enabled) {
      await saveDailyReminderSettings(nextSettings);
    }
  }

  function handleReminderStatusChange(enabled: boolean) {
    setSavedReminderTime(null);
    const nextSettings = {
      ...settings,
      enabled,
      weekdays: enabled && settings.weekdays.length === 0
        ? defaultDailyReminderSettings.weekdays
        : settings.weekdays,
    };

    handleLocalSave(nextSettings);
  }

  function toggleWeekday(weekday: ReminderWeekday) {
    setSavedReminderTime(null);
    setSettings((current) => {
      const hasWeekday = current.weekdays.includes(weekday);
      const weekdays = hasWeekday
        ? current.weekdays.filter((value) => value !== weekday)
        : [...current.weekdays, weekday].sort((left, right) => left - right);

      return {
        ...current,
        enabled: current.enabled,
        weekdays,
      };
    });
  }

  function setDisplayHour(displayHour: string) {
    setSavedReminderTime(null);
    setSettings((current) => ({
      ...current,
      hour: toTwentyFourHour(Number(displayHour), current.hour >= 12 ? 'PM' : 'AM'),
    }));
  }

  function setMinute(minute: string) {
    setSavedReminderTime(null);
    setSettings((current) => ({
      ...current,
      minute: Number(minute),
    }));
  }

  function setPeriod(period: string) {
    setSavedReminderTime(null);
    setSettings((current) => ({
      ...current,
      hour: toTwentyFourHour(formatDisplayHour(current.hour), period),
    }));
  }

  if (!entitlements.notificationsEnabled) {
    return (
      <ScreenContainer themeAware>
        <Text style={styles.title}>Daily Reminders</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Premium Feature</Text>
          <Text style={styles.body}>
            Daily reminders are available with Premium. If Premium access ends, scheduled reminders are turned off.
          </Text>
          <Pressable onPress={presentPaywall} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Back to Settings</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>Daily Reminders</Text>
      <Text style={styles.intro}>
        Set a local phone reminder to make the I Ching part of your rhythm.
      </Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.cardTitle}>Reminder Status</Text>
            <Text style={styles.body}>
              {settings.enabled ? getReminderSummary(settings) : 'Daily reminders are off.'}
            </Text>
          </View>
          <Switch
            onValueChange={handleReminderStatusChange}
            thumbColor={settings.enabled ? colors.gold : '#8b918f'}
            trackColor={{
              false: 'rgba(231, 197, 111, 0.18)',
              true: 'rgba(231, 197, 111, 0.44)',
            }}
            value={settings.enabled}
          />
        </View>
        {Platform.OS === 'web' ? (
          <Text style={styles.note}>Web preview can show this screen, but phone notifications are configured in the Android build.</Text>
        ) : null}
      </View>

      <View style={[styles.card, !settings.enabled && styles.disabledSection]}>
        <Text style={styles.cardTitle}>Select / Unselect Days</Text>
        <View style={styles.dayGrid}>
          {reminderWeekdays.map((weekday) => {
            const selected = settings.weekdays.includes(weekday.value);

            return (
              <Pressable
                disabled={!settings.enabled}
                key={weekday.value}
                onPress={() => toggleWeekday(weekday.value)}
                style={({ pressed }) => [
                  styles.dayButton,
                  selected && styles.dayButtonSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.dayCheck, selected && styles.dayCheckSelected]}>
                  {selected ? '✅' : '❌'}
                </Text>
                <Text style={[styles.dayButtonText, selected && styles.dayButtonTextSelected]}>
                  {weekday.shortLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.note}>{settings.weekdays.length} of 7 days selected.</Text>
      </View>

      <View style={[styles.card, !settings.enabled && styles.disabledSection]}>
        <Text style={styles.cardTitle}>Select a time</Text>
        <View style={styles.timePicker}>
          <DropdownSelect
            disabled={!settings.enabled}
            label="Hour"
            options={hourOptions}
            value={String(formatDisplayHour(settings.hour))}
            onSelect={setDisplayHour}
          />
          <DropdownSelect
            disabled={!settings.enabled}
            label="Minute"
            options={minuteOptions}
            value={String(settings.minute)}
            onSelect={setMinute}
          />
          <DropdownSelect
            disabled={!settings.enabled}
            label="AM/PM"
            options={periodOptions}
            value={settings.hour >= 12 ? 'PM' : 'AM'}
            onSelect={setPeriod}
          />
        </View>
        <Text style={styles.timeSummary}>
          {savedReminderTime === formatReminderTime(settings.hour, settings.minute)
            ? `Reminder set for ${formatReminderTime(settings.hour, settings.minute)}.`
            : `Click Save Reminders below to set for ${formatReminderTime(settings.hour, settings.minute)}.`}
        </Text>
      </View>

      <View style={[styles.card, !settings.enabled && styles.disabledSection]}>
        <Text style={styles.cardTitle}>Preview</Text>
        <View style={styles.previewRow}>
          <Image source={notificationPreviewIcon} style={styles.previewIcon} contentFit="cover" />
          <View style={styles.previewText}>
            <Text style={styles.previewTitle}>{previewContent.title}</Text>
            <Text style={styles.body}>{previewContent.body}</Text>
          </View>
        </View>
      </View>

      {message ? (
        <Text style={[styles.statusMessage, permissionState === 'denied' && styles.statusWarning]}>
          {message}
        </Text>
      ) : null}

      <Pressable
        disabled={isSaving || (settings.enabled && settings.weekdays.length === 0)}
        onPress={handleSave}
        style={({ pressed }) => [
          styles.primaryButton,
          (isSaving || (settings.enabled && settings.weekdays.length === 0)) && styles.disabledButton,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save Reminders'}</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/settings')} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <Text style={styles.secondaryButtonText}>Back to Settings</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function DropdownSelect({
  disabled,
  label,
  onSelect,
  options,
  value,
}: {
  disabled: boolean;
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  value: string;
}) {
  const styles = useDailyReminderStyles();
  const [open, setOpen] = useState(false);
  const selectedValue = options.includes(value) ? value : options[0];

  function handleSelect(nextValue: string) {
    if (disabled) {
      return;
    }

    setOpen(false);

    if (nextValue !== value) {
      onSelect(nextValue);
    }
  }

  return (
    <View style={styles.dropdown}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={({ pressed }) => [
          styles.dropdownField,
          open && styles.dropdownFieldOpen,
          disabled && styles.dropdownFieldDisabled,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.dropdownValue}>{selectedValue}</Text>
        <Text style={styles.dropdownArrow}>{open ? '^' : 'v'}</Text>
      </Pressable>
      {open && !disabled ? (
        <View style={styles.dropdownMenu}>
          <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
            {options.map((option) => {
              const selected = option === selectedValue;

              return (
                <Pressable
                  key={option}
                  onPress={() => handleSelect(option)}
                  style={({ pressed }) => [
                    styles.dropdownOption,
                    selected && styles.dropdownOptionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.dropdownOptionText, selected && styles.dropdownOptionTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function useDailyReminderStyles() {
  const { colorMode } = useAppTheme();

  return useMemo(() => createDailyReminderStyles(getAiChingColors(colorMode)), [colorMode]);
}

function formatDisplayHour(hour: number): number {
  return hour % 12 || 12;
}

function toTwentyFourHour(displayHour: number, period: string): number {
  const normalizedHour = displayHour === 12 ? 0 : displayHour;
  return period === 'PM' ? normalizedHour + 12 : normalizedHour;
}

function createDailyReminderStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  title: {
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 24,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 18,
    gap: 12,
    marginBottom: 14,
  },
  disabledSection: {
    opacity: 0.42,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: colors.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  settingRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    flex: 1,
    gap: 4,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 78,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  dayButtonSelected: {
    borderColor: 'rgba(139, 93, 29, 0.72)',
    backgroundColor: 'rgba(139, 93, 29, 0.16)',
  },
  dayCheck: {
    width: 18,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  dayCheckSelected: {
    color: colors.gold,
  },
  dayButtonText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  dayButtonTextSelected: {
    color: colors.gold,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdown: {
    flex: 1,
    gap: 8,
  },
  dropdownLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dropdownField: {
    width: '100%',
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.28)',
    backgroundColor: colors.inkSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dropdownFieldOpen: {
    borderColor: 'rgba(139, 93, 29, 0.62)',
    backgroundColor: 'rgba(139, 93, 29, 0.12)',
  },
  dropdownFieldDisabled: {
    opacity: 0.6,
  },
  dropdownValue: {
    color: colors.mist,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  dropdownArrow: {
    color: colors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  dropdownMenu: {
    maxHeight: 188,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.28)',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 188,
  },
  dropdownOption: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(139, 93, 29, 0.16)',
  },
  dropdownOptionText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  dropdownOptionTextSelected: {
    color: colors.gold,
  },
  timeSummary: {
    color: colors.gold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewTitle: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  previewRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
  },
  previewText: {
    flex: 1,
    gap: 4,
  },
  statusMessage: {
    color: colors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusWarning: {
    color: '#ffcf9f',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: colors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  disabledButton: {
    opacity: 0.62,
  },
  pressed: {
    opacity: 0.72,
  },
  });
}
