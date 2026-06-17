import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

export default function AboutScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>About</Text>
      <Text style={styles.intro}>
        A short note about AI Ching, its purpose, and its approach to reflection will appear here.
      </Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Coming Soon</Text>
        <Text style={styles.body}>This page is ready for your About content.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: aiChingColors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 24,
  },
  placeholder: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 8,
  },
  placeholderTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
});
