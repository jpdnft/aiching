import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const sections = [
  {
    title: 'What is a hexagram?',
    body: 'A hexagram is a stack of six yin or yang lines. In AI Ching, it becomes a simple symbolic mirror for the day.',
  },
  {
    title: 'How casting works',
    body: 'Tap CAST six times. Each tap creates one line, and the completed pattern is revealed as a reading.',
  },
  {
    title: 'Why bottom-up?',
    body: 'I Ching hexagrams are traditionally built from the ground upward. The first line you cast is the foundation.',
  },
  {
    title: 'Yin and yang lines',
    body: 'Yang appears as a solid line. Yin appears as a broken line. Phase 1 uses simple, non-changing lines.',
  },
  {
    title: 'Reflection, not prediction',
    body: 'AI Ching is designed for reflection, journaling, and symbolic exploration. It does not predict the future and should not replace professional advice.',
  },
  {
    title: 'Coming later',
    body: 'Changing lines, resulting hexagrams, deeper interpretations, journaling, and optional AI features can build on this foundation.',
  },
];

export default function GuideScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Guide</Text>
      <Text style={styles.intro}>
        A quiet ritual for noticing what the day may be asking of you.
      </Text>

      <View style={styles.sections}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
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
    marginBottom: 28,
  },
  sections: {
    gap: 18,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 16,
    gap: 6,
  },
  sectionTitle: {
    color: aiChingColors.gold,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
});
