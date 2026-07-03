import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';
import { HexagramThemeId } from '@/theme/hexagramBackgrounds';

type Props = {
  hexagramNumber: number;
  hexagramName: string;
  themeId: HexagramThemeId;
};

export function ShareHexagramButton({ hexagramName, hexagramNumber }: Props) {
  const styles = useShareHexagramButtonStyles();
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    if (isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      await Share.share({
        message: `I cast Hexagram ${hexagramNumber}: ${hexagramName} with I Ching by JPD3.`,
        title: 'Share Your Hexagram',
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share this hexagram right now.');
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isSharing}
      onPress={handleShare}
      style={({ pressed }) => [
        styles.button,
        isSharing && styles.disabled,
        pressed && !isSharing && styles.pressed,
      ]}>
      <Text style={styles.label}>{isSharing ? 'Preparing...' : 'Share This Hexagram'}</Text>
    </Pressable>
  );
}

function useShareHexagramButtonStyles() {
  const { colorMode } = useAppTheme();

  return createShareHexagramButtonStyles(getAiChingColors(colorMode));
}

function createShareHexagramButtonStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  button: {
    minWidth: 180,
    minHeight: 54,
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.58)',
    backgroundColor: 'rgba(139, 93, 29, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.48,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  });
}
