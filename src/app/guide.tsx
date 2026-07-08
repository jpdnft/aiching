import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const userGuideImage = require('@/assets/images/userguide.png');

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
  const router = useRouter();
  const styles = useGuideStyles();

  return (
    <ScreenContainer themeAware>
      <Image source={userGuideImage} style={styles.guideImage} contentFit="cover" />
      <Text style={styles.title}>User Guide</Text>
      <Text style={styles.intro}>
        A quiet ritual for noticing what the day may be asking of you.
      </Text>

      <View style={styles.versionNote}>
        <Text style={styles.body}>
          This app has two very different versions. <Text style={styles.bold}>The Basic version is free: </Text>hold a
          question in mind while casting, and the reading offers general guidance grounded in
          the I Ching hexagrams. <Text style={styles.bold}>The Premium version lets you type your question first, then
          generates an oracle-powered reading </Text>shaped by your question, your cast, deep
          hexagram-specific knowledge, and the oracle personality you choose in Settings.
        </Text>
        <Text style={styles.body}>
          In either version, it helps to understand how to frame a question and how this
          centuries-old system works. So, we recommend that you read the app's page entitled{' '}
          <Text
            accessibilityRole="link"
            onPress={() => router.push('/what-is-iching')}
            style={styles.inlineLink}>
            What Is I Ching
          </Text>{' '}
          before casting.
        </Text>
      </View>

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
  guideImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    marginBottom: 18,
    backgroundColor: colors.inkSoft,
  },
  sections: {
    gap: 18,
  },
  versionNote: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 93, 29, 0.22)',
    paddingTop: 16,
    gap: 10,
    marginBottom: 28,
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
  bold: {
    fontWeight: '800',
  },
  inlineLink: {
    color: colors.gold,
    fontWeight: '800',
    textDecorationLine: 'underline',
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
