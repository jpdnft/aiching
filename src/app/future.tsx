import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FeatureCard } from '@/components/FeatureCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const features = [
  ['Deeper AI interpretations', 'Reflective explanations grounded in curated hexagram data.'],
  ['AI chat about your reading', 'A future conversational layer for gentle follow-up questions.'],
  ['Changing lines', 'Old yin and old yang lines with resulting hexagrams.'],
  ['Personal journal', 'Private notes, mood tags, favorites, and richer reading history.'],
  ['Pattern insights', 'Themes across readings over time, once history is more mature.'],
  ['Shareable reading cards', 'Simple visual cards you choose to export.'],
];

export default function FutureScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Help Shape the Future</Text>
      <Text style={styles.intro}>
        Phase 1 stays local and simple. These ideas are placeholders for what may come next.
      </Text>

      <View style={styles.grid}>
        {features.map(([title, body]) => (
          <FeatureCard key={title} title={title} body={body} />
        ))}
      </View>

      <View style={styles.feedback}>
        <Text style={styles.feedbackTitle}>Feedback placeholder</Text>
        <Text style={styles.body}>
          A backend is intentionally not wired up yet. For now, this keeps the product ready for
          future voting without adding accounts, subscriptions, analytics, or cloud sync.
        </Text>
        <TextInput
          editable={false}
          placeholder="Coming soon: feature ideas, comments, optional email"
          placeholderTextColor="rgba(219, 226, 223, 0.48)"
          style={styles.input}
          multiline
        />
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
  grid: {
    gap: 12,
  },
  feedback: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 18,
    gap: 12,
  },
  feedbackTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    minHeight: 88,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    color: aiChingColors.mist,
    padding: 14,
    textAlignVertical: 'top',
  },
});
