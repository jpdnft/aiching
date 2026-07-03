import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

type Props = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export function CastButton({ label, disabled = false, onPress }: Props) {
  const styles = useCastButtonStyles();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function useCastButtonStyles() {
  const { colorMode } = useAppTheme();

  return createCastButtonStyles(getAiChingColors(colorMode));
}

function createCastButtonStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  button: {
    minWidth: 180,
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  });
}
