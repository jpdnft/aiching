import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { aiChingColors } from '@/theme/colors';
import { HexagramThemeId } from '@/theme/hexagramBackgrounds';
import { getHexagramShareImageSource } from '@/theme/hexagramShareImages';

type Props = {
  hexagramNumber: number;
  themeId: HexagramThemeId;
};

export function ShareHexagramButton({ hexagramNumber, themeId }: Props) {
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    if (isSharing) {
      return;
    }

    const shareImageSource = getHexagramShareImageSource(hexagramNumber, themeId);

    if (!shareImageSource) {
      Alert.alert('Share unavailable', 'No share image was found for this hexagram.');
      return;
    }

    setIsSharing(true);

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Share unavailable', 'Sharing is not available on this device.');
        return;
      }

      const [asset] = await Asset.loadAsync(shareImageSource);
      const localUri = asset.localUri ?? asset.uri;

      await Sharing.shareAsync(localUri, {
        dialogTitle: 'Share Your Hexagram',
        mimeType: 'image/jpeg',
        UTI: 'public.jpeg',
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share this hexagram image right now.');
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

const styles = StyleSheet.create({
  button: {
    minWidth: 180,
    minHeight: 54,
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.58)',
    backgroundColor: 'rgba(231, 197, 111, 0.16)',
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
    color: aiChingColors.gold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
