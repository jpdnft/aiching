import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
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
import { aiChingColors } from '@/theme/colors';

const notificationPreviewIcon = require('@/assets/icons/icon.png');
const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
const periodOptions = ['AM', 'PM'];
const wheelItemHeight = 44;
const wheelDragOffsets = [-2, -1, 0, 1, 2];

export default function DailyRemindersScreen() {
  const router = useRouter();
  const { entitlements, presentPaywall } = useAppTheme();
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
      <ScreenContainer>
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
    <ScreenContainer>
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
            thumbColor={settings.enabled ? aiChingColors.gold : '#8b918f'}
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
          <WheelSelector
            disabled={!settings.enabled}
            label="Hour"
            loop
            options={hourOptions}
            value={String(formatDisplayHour(settings.hour))}
            onSelect={setDisplayHour}
          />
          <Text style={styles.timeSeparator}>:</Text>
          <WheelSelector
            disabled={!settings.enabled}
            label="Minute"
            loop
            options={minuteOptions}
            value={String(settings.minute).padStart(2, '0')}
            onSelect={setMinute}
          />
          <WheelSelector
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

function WheelSelector({
  disabled,
  label,
  loop = false,
  onSelect,
  options,
  value,
}: {
  disabled: boolean;
  label: string;
  loop?: boolean;
  onSelect: (value: string) => void;
  options: string[];
  value: string;
}) {
  const selectedIndex = Math.max(0, options.indexOf(value));
  const dragStepRef = useRef(0);
  const gestureStartIndexRef = useRef(selectedIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          !disabled && Math.abs(gestureState.dy) > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onMoveShouldSetPanResponder: (_, gestureState) =>
          !disabled && Math.abs(gestureState.dy) > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderGrant: () => {
          dragStepRef.current = 0;
          gestureStartIndexRef.current = selectedIndex;
          setDragOffset(0);
        },
        onPanResponderMove: (_, gestureState) => {
          const nextStep = Math.trunc(gestureState.dy / wheelItemHeight);

          if (nextStep !== dragStepRef.current) {
            dragStepRef.current = nextStep;
            selectFromIndex(gestureStartIndexRef.current, -nextStep);
          }

          setDragOffset(gestureState.dy - nextStep * wheelItemHeight);
        },
        onPanResponderRelease: () => {
          dragStepRef.current = 0;
          setDragOffset(0);
        },
        onPanResponderTerminate: () => {
          dragStepRef.current = 0;
          setDragOffset(0);
        },
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
      }),
    [disabled, loop, onSelect, options, selectedIndex],
  );

  function selectByOffset(offset: number) {
    selectFromIndex(selectedIndex, offset);
  }

  function selectFromIndex(startIndex: number, offset: number) {
    if (disabled) {
      return;
    }

    const nextOption = getOffsetValue(options, startIndex, offset, loop);

    if (nextOption && nextOption !== value) {
      onSelect(nextOption);
    }
  }

  return (
    <View style={styles.wheel}>
      <Text style={styles.wheelLabel}>{label}</Text>
      <View style={styles.wheelFrame} {...panResponder.panHandlers}>
        <View pointerEvents="none" style={styles.wheelSelection} />
        <View
          style={[
            styles.wheelStrip,
            {
              transform: [{ translateY: dragOffset - wheelItemHeight }],
            },
          ]}>
          {wheelDragOffsets.map((offset) => {
            const option = getOffsetValue(options, selectedIndex, offset, loop);
            const isCenter = offset === 0;

            return (
              <Pressable
                disabled={disabled || !option || isCenter}
                key={offset}
                onPress={() => selectByOffset(offset)}
                style={({ pressed }) => [styles.wheelItem, pressed && styles.pressed]}>
                <Text style={[styles.wheelItemText, isCenter && styles.wheelItemTextSelected]}>
                  {option ?? ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function getOffsetValue(options: string[], selectedIndex: number, offset: number, loop: boolean): string | null {
  if (options.length === 0) {
    return null;
  }

  const rawIndex = selectedIndex + offset;

  if (loop) {
    return options[((rawIndex % options.length) + options.length) % options.length];
  }

  return options[rawIndex] ?? null;
}

function formatDisplayHour(hour: number): number {
  return hour % 12 || 12;
}

function toTwentyFourHour(displayHour: number, period: string): number {
  const normalizedHour = displayHour === 12 ? 0 : displayHour;
  return period === 'PM' ? normalizedHour + 12 : normalizedHour;
}

const styles = StyleSheet.create({
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: aiChingColors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 24,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 12,
    marginBottom: 14,
  },
  disabledSection: {
    opacity: 0.42,
  },
  cardTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: aiChingColors.muted,
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
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  dayButtonSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
    backgroundColor: 'rgba(231, 197, 111, 0.16)',
  },
  dayCheck: {
    width: 18,
    color: aiChingColors.muted,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  dayCheckSelected: {
    color: aiChingColors.gold,
  },
  dayButtonText: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  dayButtonTextSelected: {
    color: aiChingColors.gold,
  },
  timePicker: {
    minHeight: 188,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wheel: {
    width: 86,
    alignItems: 'center',
    gap: 8,
  },
  wheelLabel: {
    color: aiChingColors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  wheelFrame: {
    width: '100%',
    height: wheelItemHeight * 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.24)',
    backgroundColor: 'rgba(16, 19, 24, 0.72)',
    overflow: 'hidden',
  },
  wheelSelection: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: wheelItemHeight,
    height: wheelItemHeight,
    borderRadius: 8,
    backgroundColor: 'rgba(231, 197, 111, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
  },
  wheelStrip: {
    height: wheelItemHeight * 5,
  },
  wheelItem: {
    height: wheelItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    color: aiChingColors.muted,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  wheelItemTextSelected: {
    color: aiChingColors.mist,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  timeSeparator: {
    color: aiChingColors.gold,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    marginTop: 20,
  },
  timeSummary: {
    color: aiChingColors.gold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewTitle: {
    color: aiChingColors.gold,
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
    backgroundColor: 'rgba(219, 226, 223, 0.08)',
  },
  previewText: {
    flex: 1,
    gap: 4,
  },
  statusMessage: {
    color: aiChingColors.gold,
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
    backgroundColor: aiChingColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: aiChingColors.ink,
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
    borderColor: 'rgba(231, 197, 111, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: aiChingColors.gold,
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
