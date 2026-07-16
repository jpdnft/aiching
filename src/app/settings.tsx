import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { ScreenContainer } from '@/components/ScreenContainer';
import { appInfo } from '@/config/appInfo';
import {
  aiReadingPersonalities,
  AiReadingPersonality,
  AiReadingPersonalityId,
} from '@/core/aiReadings/personalities';
import { ReadingTextSize, useAppTheme } from '@/theme/appTheme';
import { CastingSound, castingSoundList } from '@/theme/castingSounds';
import { AiChingColorPalette, AppColorMode, getAiChingColors } from '@/theme/colors';
import {
  defaultDailyReminderSettings,
  getReminderSummary,
  loadDailyReminderSettings,
} from '@/services/dailyReminders';
import {
  hexagramThemeList,
  HexagramThemeId,
  HexagramThemeImageSource,
  HexagramThemeManifest,
  isBundledHexagramTheme,
  isHexagramThemePremiumOnly,
} from '@/theme/hexagramBackgrounds';
import {
  getDownloadedThemeFileUri,
  installPremiumThemePack,
  premiumThemePacks,
} from '@/services/premiumThemes';

const bundledThemeOracleSamples: Record<string, HexagramThemeImageSource> = {
  '01': require('@/assets/hexagrams/themes/01/lantern_oracle.jpg'),
  '02': require('@/assets/hexagrams/themes/02/lantern_oracle.jpg'),
};

const premiumThemePreviewSamples: Record<string, HexagramThemeImageSource> = {
  '03': require('@/assets/theme-previews/03_weathered_sage.jpg'),
  '04': require('@/assets/theme-previews/04_weathered_sage.jpg'),
  '05': require('@/assets/theme-previews/05_lantern_oracle.jpg'),
  '06': require('@/assets/theme-previews/06_river_hermit.jpg'),
  '07': require('@/assets/theme-previews/07_river_hermit.jpg'),
  '08': require('@/assets/theme-previews/08_lantern_oracle.jpg'),
};

const personalitySamples: Record<AiReadingPersonalityId, number> = {
  lantern_oracle: require('@/assets/hexagrams/themes/02/lantern_oracle.jpg'),
  weathered_sage: require('@/assets/hexagrams/themes/01/weathered_sage.jpg'),
  temple_poet: require('@/assets/hexagrams/themes/02/temple_poet.jpg'),
  river_hermit: require('@/assets/hexagrams/themes/02/river_hermit.jpg'),
  star_cartographer: require('@/assets/hexagrams/themes/01/star_cartographer.jpg'),
  tea_house_auntie: require('@/assets/hexagrams/themes/01/tea_house_auntie.jpg'),
  mountain_strategist: require('@/assets/hexagrams/themes/02/mountain_strategist.jpg'),
  dream_librarian: require('@/assets/hexagrams/themes/02/dream_librarian.jpg'),
  storm_witch: require('@/assets/hexagrams/themes/01/storm_witch.jpg'),
  garden_monk: require('@/assets/hexagrams/themes/02/garden_monk.jpg'),
};

export default function SettingsScreen() {
  const router = useRouter();
  const {
    aiReadingPersonalityId,
    castingSoundId,
    colorMode,
    entitlements,
    installedPremiumThemeIds,
    presentPaywall,
    refreshInstalledPremiumThemes,
    setAiReadingPersonalityId,
    setCastingSoundId,
    setColorMode,
    setReadingTextSize,
    setSoundEffectsEnabled,
    setThemeId,
    readingTextSize,
    soundEffectsEnabled,
    themeId,
  } = useAppTheme();
  const styles = useSettingsStyles();
  const colors = getAiChingColors(colorMode);
  const [dailyReminderSummary, setDailyReminderSummary] = useState(
    getReminderSummary(defaultDailyReminderSettings),
  );
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(false);
  const [themeInstallErrorMessage, setThemeInstallErrorMessage] = useState<string | null>(null);
  const [downloadingThemeId, setDownloadingThemeId] = useState<string | null>(null);

  const visibleThemes = useMemo(() => {
    const themesById = new Map<string, HexagramThemeManifest>();

    hexagramThemeList.forEach((theme) => themesById.set(theme.id, theme));
    premiumThemePacks.forEach((themePack) => {
      themesById.set(themePack.themeId, {
        id: themePack.themeId,
        name: themePack.name,
        description: themePack.description ?? `Premium theme ${themePack.themeId}.`,
        isAvailable: installedPremiumThemeIds.includes(themePack.themeId),
        isPremiumOnly: true,
      });
    });

    return [...themesById.values()].sort((left, right) => left.id.localeCompare(right.id));
  }, [installedPremiumThemeIds]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      loadDailyReminderSettings().then((settings) => {
        if (!active) {
          return;
        }

        setDailyRemindersEnabled(settings.enabled);
        setDailyReminderSummary(getReminderSummary(settings));
      });

      refreshInstalledPremiumThemes();

      return () => {
        active = false;
      };
    }, [refreshInstalledPremiumThemes]),
  );

  async function handleThemePress(theme: HexagramThemeManifest) {
    const premiumOnly = isHexagramThemePremiumOnly(theme.id);
    const installed = !premiumOnly || installedPremiumThemeIds.includes(theme.id);

    if (premiumOnly && !entitlements.premiumThemesEnabled && theme.id !== themeId) {
      await presentPaywall();
      return;
    }

    if (!installed) {
      const themePack = premiumThemePacks.find((item) => item.themeId === theme.id);

      if (!themePack) {
        setThemeInstallErrorMessage('This premium theme is not available to install yet.');
        return;
      }

      setDownloadingThemeId(theme.id);

      try {
        await installPremiumThemePack(themePack);
        await refreshInstalledPremiumThemes();
        await setThemeId(theme.id);
        setThemeInstallErrorMessage(null);
      } catch (error) {
        setThemeInstallErrorMessage(getSettingsErrorMessage(error));
      } finally {
        setDownloadingThemeId(null);
      }

      return;
    }

    await setThemeId(theme.id);
  }

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.intro}>
        Choose the visual theme used for casting, readings, and history.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Text style={styles.settingDescription}>
          Dark mode is the default. Light mode uses a warmer parchment palette for brighter spaces.
        </Text>
        <View style={styles.appearanceOptions}>
          {appearanceModeOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setColorMode(option.value)}
              style={({ pressed }) => [
                styles.appearanceOption,
                option.value === colorMode && styles.textSizeOptionSelected,
                pressed && styles.themeOptionPressed,
              ]}>
              <Text
                style={[
                  styles.textSizeOptionText,
                  option.value === colorMode && styles.textSizeOptionTextSelected,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.settingDescription}>
          BASIC includes two themes. Premium themes install only after you choose them.
        </Text>
        <View style={styles.themeList}>
          {visibleThemes.map((theme) => (
            <ThemeOption
              key={theme.id}
              avatarSource={getThemeSampleImage(theme.id, installedPremiumThemeIds)}
              downloading={downloadingThemeId === theme.id}
              installed={isBundledHexagramTheme(theme.id) || installedPremiumThemeIds.includes(theme.id)}
              premiumThemesEnabled={entitlements.premiumThemesEnabled}
              theme={theme}
              selected={theme.id === themeId}
              onPress={() => handleThemePress(theme)}
            />
          ))}
        </View>
        {themeInstallErrorMessage ? <Text style={styles.errorText}>{themeInstallErrorMessage}</Text> : null}
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
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.sectionTitle}>Daily Reminders</Text>
            <Text style={styles.settingDescription}>
              Premium feature. Choose which days your phone should remind you to consult the I Ching.
            </Text>
            <Text style={styles.settingDescription}>
              {entitlements.notificationsEnabled
                ? dailyRemindersEnabled
                  ? `Enabled: ${dailyReminderSummary}`
                  : 'Disabled. Configure a time and days when you are ready.'
                : 'Upgrade to Premium to enable daily reminders.'}
            </Text>
          </View>
          <Text style={[styles.themeState, entitlements.notificationsEnabled && styles.themeStateSelected]}>
            {entitlements.notificationsEnabled ? 'Premium' : 'Locked'}
          </Text>
        </View>
        <Pressable
          disabled={!entitlements.notificationsEnabled}
          onPress={() => router.push('/daily-reminders')}
          style={({ pressed }) => [
            styles.configureButton,
            !entitlements.notificationsEnabled && styles.themeOptionDisabled,
            pressed && entitlements.notificationsEnabled && styles.themeOptionPressed,
          ]}>
          <Text style={styles.configureButtonText}>
            {entitlements.notificationsEnabled ? 'Configure Reminders' : 'Premium Feature'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Oracle / Personality</Text>
        <Text style={styles.settingDescription}>
          Choose the persnality that your oracle has for your readings.
        </Text>
        {!entitlements.aiReadingsEnabled ? (
          <Text style={styles.lockedNote}>Premium feature. Manage Version to unlock oracle-powered readings.</Text>
        ) : null}
        <View style={styles.personalityList}>
          {aiReadingPersonalities.map((personality) => (
            <PersonalityOption
              disabled={!entitlements.aiReadingsEnabled}
              key={personality.id}
              avatarSource={personalitySamples[personality.id]}
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
            thumbColor={soundEffectsEnabled ? colors.gold : '#8b918f'}
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
        <Text style={styles.settingDescription}>Timestamp {appInfo.buildTimestampCode}</Text>
      </View>
    </ScreenContainer>
  );
}

const readingTextSizeOptions: { label: string; value: ReadingTextSize }[] = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'extraLarge' },
];

const appearanceModeOptions: { label: string; value: AppColorMode }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
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

function getThemeSampleImage(
  themeId: HexagramThemeId,
  installedPremiumThemeIds: string[],
): HexagramThemeImageSource {
  if (bundledThemeOracleSamples[themeId]) {
    return bundledThemeOracleSamples[themeId];
  }

  if (premiumThemePreviewSamples[themeId]) {
    return premiumThemePreviewSamples[themeId];
  }

  if (installedPremiumThemeIds.includes(themeId)) {
    return getDownloadedThemeFileUri(themeId, 'lantern_oracle.jpg');
  }

  return bundledThemeOracleSamples['02'];
}

function getSettingsErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to update settings.';
}

function useSettingsStyles() {
  const { colorMode } = useAppTheme();

  return useMemo(() => createSettingsStyles(getAiChingColors(colorMode)), [colorMode]);
}

function ThemeOption({
  avatarSource,
  downloading,
  installed,
  premiumThemesEnabled,
  theme,
  selected,
  onPress,
}: {
  avatarSource: HexagramThemeImageSource;
  downloading: boolean;
  installed: boolean;
  premiumThemesEnabled: boolean;
  theme: HexagramThemeManifest;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = useSettingsStyles();
  const premiumLocked = isHexagramThemePremiumOnly(theme.id) && !premiumThemesEnabled;
  const disabled = downloading;
  const stateLabel = selected
    ? 'Selected'
    : downloading
      ? 'Installing'
      : premiumLocked
        ? 'Premium'
        : installed
          ? 'Select'
          : 'Install';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeOption,
        selected && styles.themeOptionSelected,
        (disabled || (premiumLocked && !selected)) && styles.themeOptionDisabled,
        pressed && !disabled && styles.themeOptionPressed,
      ]}>
      <Image source={avatarSource} style={styles.optionAvatar} contentFit="cover" />
      <View style={styles.themeText}>
        <Text style={styles.themeName}>{theme.name}</Text>
        <Text style={styles.themeMeta}>{theme.description}</Text>
      </View>
      <Text style={[styles.themeState, selected && styles.themeStateSelected]}>
        {stateLabel}
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
  const styles = useSettingsStyles();
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
  avatarSource,
  disabled,
  onSelect,
  personality,
  selected,
}: {
  avatarSource: number;
  disabled: boolean;
  onSelect: () => void;
  personality: AiReadingPersonality;
  selected: boolean;
}) {
  const styles = useSettingsStyles();
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
      <Image source={avatarSource} style={styles.optionAvatar} contentFit="cover" />
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

function createSettingsStyles(colors: AiChingColorPalette) {
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
  section: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 18,
    gap: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.gold,
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
    backgroundColor: colors.inkSoft,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeOptionSelected: {
    borderColor: 'rgba(139, 93, 29, 0.72)',
  },
  themeOptionDisabled: {
    opacity: 0.52,
  },
  themeOptionPressed: {
    opacity: 0.78,
  },
  optionAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
  },
  themeText: {
    flex: 1,
    gap: 4,
  },
  themeName: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  themeMeta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  themeState: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  themeStateSelected: {
    color: colors.gold,
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
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  textSizeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  appearanceOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  appearanceOption: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textSizeOption: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textSizeOptionSelected: {
    borderColor: 'rgba(139, 93, 29, 0.72)',
    backgroundColor: 'rgba(139, 93, 29, 0.16)',
  },
  textSizeOptionText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  textSizeOptionTextSelected: {
    color: colors.gold,
  },
  textSizePreview: {
    color: colors.mist,
  },
  personalityList: {
    gap: 10,
  },
  personalityOption: {
    minHeight: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedNote: {
    color: colors.gold,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  errorText: {
    color: '#ffb4a8',
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
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundOptionSelected: {
    borderColor: 'rgba(139, 93, 29, 0.72)',
  },
  previewButton: {
    width: 50,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
  },
  previewButtonPressed: {
    opacity: 0.78,
  },
  previewButtonText: {
    color: colors.ink,
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
  configureButton: {
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  configureButtonText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  });
}
