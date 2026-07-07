import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const sections = [
  {
    title: 'What is a hexagram?',
    body: 'A hexagram is a stack of six yin or yang lines. Here, it becomes a simple symbolic mirror for the day.',
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
    body: 'Yang appears as a solid line. Yin appears as a broken line. The basic level of this app uses simple, non-changing lines. The premium version includes changing lines, which can add depth to your reading.',
  },
  {
    title: 'Reflection, not prediction',
    body: 'This I Ching app is designed for reflection and symbolic exploration. It does not predict the future and should not replace professional advice.',
  },
  {
    title: 'Need Support, or Have Feedback?',
    body: 'For questions, help, or feedback, please visit Jim Dee\'s contact page.',
    linkLabel: 'jpd3.com/contact',
    url: 'https://jpd3.com/contact',
  },
];

export default function GuideScreen() {
  const styles = useGuideStyles();

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>User Guide</Text>
      <Text style={styles.intro}>
        A quiet ritual for noticing what the day may be asking of you.
      </Text>

      <View style={styles.sections}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
            {'url' in section && section.url ? (
              <Pressable
                accessibilityRole="link"
                onPress={() => Linking.openURL(section.url)}
                style={({ pressed }) => pressed && styles.linkPressed}>
                <Text style={styles.link}>{section.linkLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

function useGuideStyles() {
  const { colorMode } = useAppTheme();

  return createGuideStyles(getAiChingColors(colorMode));
}

function createGuideStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  title: {
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 28,
  },
  sections: {
    gap: 18,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 93, 29, 0.22)',
    paddingTop: 16,
    gap: 6,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  linkPressed: {
    opacity: 0.72,
  },
  });
}
