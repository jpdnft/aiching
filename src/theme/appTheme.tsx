import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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

export type ReadingTextSize = 'comfortable' | 'large' | 'extraLarge';

type AppThemeContextValue = {
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

export function AppThemeProvider({ children }: PropsWithChildren) {
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
      castingSoundId,
      readingTextSize,
      setCastingSoundId,
      setReadingTextSize,
      setSoundEffectsEnabled,
      setThemeId,
      soundEffectsEnabled,
      themeId,
    }),
    [
      castingSoundId,
      readingTextSize,
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
