import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const sections = [
  {
    title: 'Questions and AI Readings',
    body:
      'Premium readings send your question, selected hexagram, selected oracle personality, and selected theme mood to our AI reading service so the app can generate your custom interpretation.',
  },
  {
    title: 'How Question Text May Be Used',
    body:
      'We may retain question text in a de-identified way for internal review, product improvement, and marketing insight. For example, if someone asks, "Will I win the lottery?", we may use that question to understand what people are curious about, but not to identify who asked it.',
  },
  {
    title: 'What We Do Not Intend to Keep',
    body:
      'We do not intend to retain personally identifying information with your reading questions, and users should avoid entering names, addresses, financial account details, medical details, or other sensitive personal information into a reading question.',
  },
  {
    title: 'Local Reading History',
    body:
      'Your reading history is stored on your device so you can revisit past readings. Clearing app data or reading history may remove that local history.',
  },
  {
    title: 'Reflection, Not Professional Advice',
    body:
      'Readings are for reflection, symbolism, and personal insight. They should not replace professional legal, medical, financial, or mental health advice.',
  },
];

export default function DataPolicyScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Data & Privacy</Text>
      <Text style={styles.intro}>
        A brief plain-language note about Premium questions and reading data.
      </Text>

      <View style={styles.sections}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/more')}
        style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
        <Text style={styles.backText}>Back to More</Text>
      </Pressable>
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
    marginBottom: 24,
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
    lineHeight: 23,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  backLink: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    color: aiChingColors.gold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
