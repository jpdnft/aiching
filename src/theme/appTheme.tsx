import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  AiReadingPersonalityId,
  defaultAiReadingPersonalityId,
  isAiReadingPersonalityId,
} from '@/core/aiReadings/personalities';
import {
  CastingSoundId,
  defaultCastingSoundId,
  isCastingSoundId,
} from './castingSounds';
import {
  defaultHexagramThemeId,
  HexagramThemeId,
  isHexagramThemeAvailable,
} from './hexagramBackgrounds';

const THEME_STORAGE_KEY = 'aiching.theme.selected.v1';
const SOUND_EFFECTS_STORAGE_KEY = 'aiching.soundEffects.enabled.v1';
const CASTING_SOUND_STORAGE_KEY = 'aiching.soundEffects.castingSound.v1';
const READING_TEXT_SIZE_STORAGE_KEY = 'aiching.reading.textSize.v1';
const APP_VERSION_STORAGE_KEY = 'aiching.version.selected.v1';
const AI_READING_PERSONALITY_STORAGE_KEY = 'aiching.aiReading.personality.v1';

export type ReadingTextSize = 'comfortable' | 'large' | 'extraLarge';
export type AppVersion = 'basic' | 'premium';

export type AppEntitlements = {
  adsEnabled: boolean;
  aiReadingsEnabled: boolean;
  notificationsEnabled: boolean;
  premiumThemesEnabled: boolean;
  unlimitedCastingEnabled: boolean;
};

type AppThemeContextValue = {
  appVersion: AppVersion;
  aiReadingPersonalityId: AiReadingPersonalityId;
  entitlements: AppEntitlements;
  setAppVersion: (version: AppVersion) => Promise<void>;
  setAiReadingPersonalityId: (personalityId: AiReadingPersonalityId) => Promise<void>;
  themeId: HexagramThemeId;
  setThemeId: (themeId: HexagramThemeId) => Promise<void>;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => Promise<void>;
  castingSoundId: CastingSoundId;
  setCastingSoundId: (soundId: CastingSoundId) => Promise<void>;
  readingTextSize: ReadingTextSize;
  setReadingTextSize: (textSize: ReadingTextSize) => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function isThemeId(value: string | null): value is HexagramThemeId {
  return value === '01' || value === '02';
}

function isReadingTextSize(value: string | null): value is ReadingTextSize {
  return value === 'comfortable' || value === 'large' || value === 'extraLarge';
}

function isAppVersion(value: string | null): value is AppVersion {
  return value === 'basic' || value === 'premium';
}

function getEntitlements(version: AppVersion): AppEntitlements {
  const isPremium = version === 'premium';

  return {
    adsEnabled: !isPremium,
    aiReadingsEnabled: isPremium,
    notificationsEnabled: isPremium,
    premiumThemesEnabled: isPremium,
    unlimitedCastingEnabled: isPremium,
  };
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [appVersion, setAppVersionState] = useState<AppVersion>('basic');
  const [aiReadingPersonalityId, setAiReadingPersonalityIdState] = useState<AiReadingPersonalityId>(
    defaultAiReadingPersonalityId,
  );
  const [themeId, setThemeIdState] = useState<HexagramThemeId>(defaultHexagramThemeId);
  const [soundEffectsEnabled, setSoundEffectsEnabledState] = useState(true);
  const [castingSoundId, setCastingSoundIdState] = useState<CastingSoundId>(defaultCastingSoundId);
  const [readingTextSize, setReadingTextSizeState] = useState<ReadingTextSize>('comfortable');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((storedThemeId) => {
      if (isThemeId(storedThemeId) && isHexagramThemeAvailable(storedThemeId)) {
        setThemeIdState(storedThemeId);
      }
    });

    AsyncStorage.getItem(SOUND_EFFECTS_STORAGE_KEY).then((storedSoundEffectsEnabled) => {
      if (storedSoundEffectsEnabled === 'false') {
        setSoundEffectsEnabledState(false);
      }
    });

    AsyncStorage.getItem(CASTING_SOUND_STORAGE_KEY).then((storedCastingSoundId) => {
      if (isCastingSoundId(storedCastingSoundId)) {
        setCastingSoundIdState(storedCastingSoundId);
      }
    });

    AsyncStorage.getItem(READING_TEXT_SIZE_STORAGE_KEY).then((storedReadingTextSize) => {
      if (isReadingTextSize(storedReadingTextSize)) {
        setReadingTextSizeState(storedReadingTextSize);
      }
    });

    AsyncStorage.getItem(APP_VERSION_STORAGE_KEY).then((storedAppVersion) => {
      if (isAppVersion(storedAppVersion)) {
        setAppVersionState(storedAppVersion);
      }
    });

    AsyncStorage.getItem(AI_READING_PERSONALITY_STORAGE_KEY).then((storedPersonalityId) => {
      if (isAiReadingPersonalityId(storedPersonalityId)) {
        setAiReadingPersonalityIdState(storedPersonalityId);
      }
    });
  }, []);

  const setAppVersion = useCallback(async (version: AppVersion) => {
    await AsyncStorage.setItem(APP_VERSION_STORAGE_KEY, version);
    setAppVersionState(version);
  }, []);

  const setAiReadingPersonalityId = useCallback(async (personalityId: AiReadingPersonalityId) => {
    await AsyncStorage.setItem(AI_READING_PERSONALITY_STORAGE_KEY, personalityId);
    setAiReadingPersonalityIdState(personalityId);
  }, []);

  const setThemeId = useCallback(async (nextThemeId: HexagramThemeId) => {
    if (!isHexagramThemeAvailable(nextThemeId)) {
      return;
    }

    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextThemeId);
    setThemeIdState(nextThemeId);
  }, []);

  const setSoundEffectsEnabled = useCallback(async (enabled: boolean) => {
    await AsyncStorage.setItem(SOUND_EFFECTS_STORAGE_KEY, String(enabled));
    setSoundEffectsEnabledState(enabled);
  }, []);

  const setCastingSoundId = useCallback(async (soundId: CastingSoundId) => {
    await AsyncStorage.setItem(CASTING_SOUND_STORAGE_KEY, soundId);
    setCastingSoundIdState(soundId);
  }, []);

  const setReadingTextSize = useCallback(async (textSize: ReadingTextSize) => {
    await AsyncStorage.setItem(READING_TEXT_SIZE_STORAGE_KEY, textSize);
    setReadingTextSizeState(textSize);
  }, []);

  const value = useMemo(
    () => ({
      appVersion,
      aiReadingPersonalityId,
      castingSoundId,
      entitlements: getEntitlements(appVersion),
      readingTextSize,
      setAiReadingPersonalityId,
      setAppVersion,
      setCastingSoundId,
      setReadingTextSize,
      setSoundEffectsEnabled,
      setThemeId,
      soundEffectsEnabled,
      themeId,
    }),
    [
      appVersion,
      aiReadingPersonalityId,
      castingSoundId,
      readingTextSize,
      setAiReadingPersonalityId,
      setAppVersion,
      setCastingSoundId,
      setReadingTextSize,
      setSoundEffectsEnabled,
      setThemeId,
      soundEffectsEnabled,
      themeId,
    ],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }

  return context;
}
