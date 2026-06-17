import { StyleSheet, Text, View } from 'react-native';

import { aiChingColors } from '@/theme/colors';

type Props = {
  title: string;
  body: string;
};

export function FeatureCard({ title, body }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 16,
    gap: 6,
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
