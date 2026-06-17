import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  defaultHexagramThemeId,
  HexagramThemeId,
  isHexagramThemeAvailable,
} from './hexagramBackgrounds';

const THEME_STORAGE_KEY = 'aiching.theme.selected.v1';
const SOUND_EFFECTS_STORAGE_KEY = 'aiching.soundEffects.enabled.v1';

type AppThemeContextValue = {
  themeId: HexagramThemeId;
  setThemeId: (themeId: HexagramThemeId) => Promise<void>;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function isThemeId(value: string | null): value is HexagramThemeId {
  return value === '01' || value === '02';
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [themeId, setThemeIdState] = useState<HexagramThemeId>(defaultHexagramThemeId);
  const [soundEffectsEnabled, setSoundEffectsEnabledState] = useState(true);

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

  const value = useMemo(
    () => ({ themeId, setThemeId, soundEffectsEnabled, setSoundEffectsEnabled }),
    [setSoundEffectsEnabled, setThemeId, soundEffectsEnabled, themeId],
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
