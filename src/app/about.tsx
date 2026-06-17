import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const webDevCard = require('../../assets/images/card-webdev.webp');
const portfolioUrl = 'https://jpd3.com/resume/web-developer';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>About the Developer</Text>

      <View style={styles.card}>
        <Image
          source={webDevCard}
          style={styles.heroImage}
          contentFit="cover"
          accessibilityLabel="Jim Dee web developer portfolio card"
        />

        <Text style={styles.body}>
          Hi, I'm Jim Dee, a full-stack web developer with 15+ years of experience shipping
          practical software that solves real problems.
        </Text>
        <Text style={styles.body}>
          I build modern React Native, React, Next.js, and Firebase applications, along with
          Web3/smart contract platforms, AI-driven tools, APIs, and legacy CMS/database systems.
          My work includes high-stakes launches, tricky integrations, clean front ends, reliable
          back-end workflows, and documentation that helps teams move faster.
        </Text>
        <Text style={styles.body}>
          If you need a thoughtful builder who can turn a fuzzy idea into working software without
          drama, I would be glad to talk.
        </Text>

        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(portfolioUrl)}
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}>
          <Text style={styles.linkButtonText}>✨ View Portfolio and Resume</Text>
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

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    maxWidth: 420,
    height: 236,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: aiChingColors.surface,
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 14,
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  linkButton: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: aiChingColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 4,
  },
  linkButtonPressed: {
    opacity: 0.78,
  },
  linkButtonText: {
    color: aiChingColors.ink,
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
    color: aiChingColors.gold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
