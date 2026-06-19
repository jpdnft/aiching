import { useEffect } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { ScreenContainer } from '@/components/ScreenContainer';
import { appInfo } from '@/config/appInfo';
import { aiReadingPersonalities, AiReadingPersonality } from '@/core/aiReadings/personalities';
import { ReadingTextSize, useAppTheme } from '@/theme/appTheme';
import { CastingSound, castingSoundList } from '@/theme/castingSounds';
import { aiChingColors } from '@/theme/colors';
import { hexagramThemeList, HexagramThemeManifest } from '@/theme/hexagramBackgrounds';

export default function SettingsScreen() {
  const {
    aiReadingPersonalityId,
    castingSoundId,
    entitlements,
    setAiReadingPersonalityId,
    setCastingSoundId,
    setReadingTextSize,
    setSoundEffectsEnabled,
    setThemeId,
    readingTextSize,
    soundEffectsEnabled,
    themeId,
  } = useAppTheme();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.intro}>
        Choose the visual theme used for casting, readings, and history.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeList}>
          {hexagramThemeList.map((theme) => (
            <ThemeOption
              key={theme.id}
              theme={theme}
              selected={theme.id === themeId}
              onPress={() => setThemeId(theme.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Text Size</Text>
        <Text style={styles.settingDescription}>
          Adjust the reading page text for easier, more comfortable reading.
        </Text>
        <View style={styles.textSizeOptions}>
          {readingTextSizeOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setReadingTextSize(option.value)}
              style={({ pressed }) => [
                styles.textSizeOption,
                option.value === readingTextSize && styles.textSizeOptionSelected,
                pressed && styles.themeOptionPressed,
              ]}>
              <Text
                style={[
                  styles.textSizeOptionText,
                  option.value === readingTextSize && styles.textSizeOptionTextSelected,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.textSizePreview, textSizePreviewStyles[readingTextSize]]}>
          PREVIEW: This is how the text will look on the Readings page with the setting selected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Oracle / Personality</Text>
        <Text style={styles.settingDescription}>
          Choose the persnality that your oracle has for your readings.
        </Text>
        {!entitlements.aiReadingsEnabled ? (
          <Text style={styles.lockedNote}>Premium feature. Manage Version to unlock AI readings.</Text>
        ) : null}
        <View style={styles.personalityList}>
          {aiReadingPersonalities.map((personality) => (
            <PersonalityOption
              disabled={!entitlements.aiReadingsEnabled}
              key={personality.id}
              onSelect={() => setAiReadingPersonalityId(personality.id)}
              personality={personality}
              selected={personality.id === aiReadingPersonalityId}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.sectionTitle}>Sound Effects</Text>
            <Text style={styles.settingDescription}>
              Play a soft sound when each casting line arrives.
            </Text>
          </View>
          <Switch
            onValueChange={setSoundEffectsEnabled}
            thumbColor={soundEffectsEnabled ? aiChingColors.gold : '#8b918f'}
            trackColor={{
              false: 'rgba(231, 197, 111, 0.18)',
              true: 'rgba(231, 197, 111, 0.44)',
            }}
            value={soundEffectsEnabled}
          />
        </View>

        <View style={styles.soundList}>
          {castingSoundList.map((sound) => (
            <SoundOption
              key={sound.id}
              onSelect={() => setCastingSoundId(sound.id)}
              selected={sound.id === castingSoundId}
              sound={sound}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Build</Text>
        <Text style={styles.settingDescription}>Version {appInfo.version}</Text>
        <Text style={styles.settingDescription}>Bundle {appInfo.buildLabel}</Text>
      </View>
    </ScreenContainer>
  );
}

const readingTextSizeOptions: Array<{ label: string; value: ReadingTextSize }> = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'extraLarge' },
];

const textSizePreviewStyles: Record<ReadingTextSize, { fontSize: number; lineHeight: number }> = {
  comfortable: {
    fontSize: 15,
    lineHeight: 22,
  },
  large: {
    fontSize: 17,
    lineHeight: 26,
  },
  extraLarge: {
    fontSize: 19,
    lineHeight: 29,
  },
};

function ThemeOption({
  theme,
  selected,
  onPress,
}: {
  theme: HexagramThemeManifest;
  selected: boolean;
  onPress: () => void;
}) {
  const disabled = !theme.isAvailable;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeOption,
        selected && styles.themeOptionSelected,
        disabled && styles.themeOptionDisabled,
        pressed && !disabled && styles.themeOptionPressed,
      ]}>
      <View style={styles.themeText}>
        <Text style={styles.themeName}>{theme.name}</Text>
        <Text style={styles.themeMeta}>{theme.description}</Text>
      </View>
      <Text style={[styles.themeState, selected && styles.themeStateSelected]}>
        {selected ? 'Selected' : disabled ? 'Locked' : 'Select'}
      </Text>
    </Pressable>
  );
}

function SoundOption({
  onSelect,
  selected,
  sound,
}: {
  onSelect: () => void;
  selected: boolean;
  sound: CastingSound;
}) {
  const player = useAudioPlayer(sound.source, { downloadFirst: true });

  useEffect(() => {
    player.volume = 0.5;

    setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: true,
    }).catch(() => {
      // Sound previews are optional; settings should remain usable without playback.
    });
  }, [player]);

  function handlePreview() {
    player
      .seekTo(0)
      .then(() => player.play())
      .catch(() => {
        // Keep the chooser quiet if a preview cannot play.
      });
  }

  return (
    <View style={[styles.soundOption, selected && styles.soundOptionSelected]}>
      <Pressable
        accessibilityLabel={`Preview ${sound.name}`}
        onPress={handlePreview}
        style={({ pressed }) => [styles.previewButton, pressed && styles.previewButtonPressed]}>
        <Text style={styles.previewButtonText}>Play</Text>
      </Pressable>
      <Pressable
        onPress={onSelect}
        style={({ pressed }) => [styles.soundTextButton, pressed && styles.themeOptionPressed]}>
        <View style={styles.themeText}>
          <Text style={styles.themeName}>{sound.name}</Text>
          <Text style={styles.themeMeta}>{sound.filename}</Text>
        </View>
        <Text style={[styles.themeState, selected && styles.themeStateSelected]}>
          {selected ? 'Selected' : 'Select'}
        </Text>
      </Pressable>
    </View>
  );
}

function PersonalityOption({
  disabled,
  onSelect,
  personality,
  selected,
}: {
  disabled: boolean;
  onSelect: () => void;
  personality: AiReadingPersonality;
  selected: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.personalityOption,
        selected && styles.textSizeOptionSelected,
        disabled && styles.themeOptionDisabled,
        pressed && !disabled && styles.themeOptionPressed,
      ]}>
      <View style={styles.themeText}>
        <Text style={[styles.themeName, selected && styles.themeStateSelected]}>{personality.name}</Text>
        <Text style={styles.themeMeta}>{personality.description}</Text>
      </View>
      <Text style={[styles.themeState, selected && styles.themeStateSelected]}>
        {selected ? 'Selected' : disabled ? 'Locked' : 'Select'}
      </Text>
    </Pressable>
  );
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
  section: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  themeList: {
    gap: 10,
  },
  themeOption: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeOptionSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
  },
  themeOptionDisabled: {
    opacity: 0.52,
  },
  themeOptionPressed: {
    opacity: 0.78,
  },
  themeText: {
    flex: 1,
    gap: 4,
  },
  themeName: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  themeMeta: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  themeState: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  themeStateSelected: {
    color: aiChingColors.gold,
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
  settingDescription: {
    color: aiChingColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  textSizeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  textSizeOption: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textSizeOptionSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
    backgroundColor: 'rgba(231, 197, 111, 0.16)',
  },
  textSizeOptionText: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  textSizeOptionTextSelected: {
    color: aiChingColors.gold,
  },
  textSizePreview: {
    color: aiChingColors.mist,
  },
  personalityList: {
    gap: 10,
  },
  personalityOption: {
    minHeight: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedNote: {
    color: aiChingColors.gold,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  soundList: {
    gap: 10,
  },
  soundOption: {
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundOptionSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
  },
  previewButton: {
    width: 50,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: aiChingColors.gold,
  },
  previewButtonPressed: {
    opacity: 0.78,
  },
  previewButtonText: {
    color: aiChingColors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  soundTextButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
