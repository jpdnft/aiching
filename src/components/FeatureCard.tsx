import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

type Props = {
  title: string;
  body: string;
};

export function FeatureCard({ title, body }: Props) {
  const styles = useFeatureCardStyles();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function useFeatureCardStyles() {
  const { colorMode } = useAppTheme();

  return createFeatureCardStyles(getAiChingColors(colorMode));
}

function createFeatureCardStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 16,
    gap: 6,
  },
  title: {
    color: colors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  });
}
