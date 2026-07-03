import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const webDevCard = require('../../assets/images/card-webdev.webp');
const portfolioUrl = 'https://jpd3.com/resume/web-developer';

export default function AboutScreen() {
  const router = useRouter();
  const styles = useAboutStyles();

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>About the Developer</Text>

      <View style={styles.card}>
        <Image
          source={webDevCard}
          style={styles.heroImage}
          contentFit="cover"
          accessibilityLabel="Jim Dee developer portfolio card"
        />

        <Text style={styles.body}>
          Hi, I'm Jim Dee, a full-stack developer with 15+ years of experience shipping
          practical software that solves real problems.
        </Text>
        <Text style={styles.body}>
          I build modern React Native, React, Next.js, and Firebase applications, along with web3 / blockchain applications, AI-driven tools, APIs, and even legacy CMS / database systems. Got PHP and MySQL? I can help there too. My work includes high-stakes launches, tricky integrations, clean front ends, reliable
          back-end workflows, and documentation that helps teams move faster.
        </Text>
        <Text style={styles.body}>
          If you need a thoughtful builder who can turn a fuzzy idea into working software fast and without
          drama, I'd be glad to talk. Click the button below to view my resume and contact me.
        </Text>

        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(portfolioUrl)}
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}>
          <Text style={styles.linkButtonText}>🖥️ View Portfolio and Resume ➜</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push('/more')}
        style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}>
        <Text style={styles.backLinkText}>Back to More</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function useAboutStyles() {
  const { colorMode } = useAppTheme();

  return createAboutStyles(getAiChingColors(colorMode));
}

function createAboutStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  heroImage: {
    width: '100%',
    maxWidth: 420,
    height: 236,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 18,
    gap: 14,
  },
  body: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  linkButton: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 4,
  },
  linkButtonPressed: {
    opacity: 0.78,
  },
  linkButtonText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  backLink: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
  },
  backLinkPressed: {
    opacity: 0.72,
  },
  backLinkText: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  });
}
