import { Pressable, StyleSheet, Text } from 'react-native';

import { aiChingColors } from '@/theme/colors';

type Props = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export function CastButton({ label, disabled = false, onPress }: Props) {
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

const styles = StyleSheet.create({
  button: {
    minWidth: 180,
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: aiChingColors.gold,
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
    color: aiChingColors.ink,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
