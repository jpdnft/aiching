import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const features = [
  {
    title: 'Dramatic Readings',
    body: 'If high-quality generated voice costs come down, we would love to explore dramatic audio readings. Right now, costs are too high to offer this at scale.',
    avatar: require('@/assets/hexagrams/themes/01/storm_witch.jpg'),
  },
  {
    title: 'AI chat about your reading',
    body: 'A future conversational layer for gentle follow-up questions.',
    avatar: require('@/assets/hexagrams/themes/02/star_cartographer.jpg'),
  },
  {
    title: 'Changing lines',
    body: 'Old yin and old yang lines with resulting hexagrams.',
    avatar: require('@/assets/hexagrams/themes/01/mountain_strategist.jpg'),
  },
  {
    title: 'Pattern insights',
    body: 'Themes across readings over time, once history is more mature.',
    avatar: require('@/assets/hexagrams/themes/03/dream_librarian.jpg'),
  },
];

const feedbackAvatar = require('@/assets/hexagrams/themes/02/tea_house_auntie.jpg');

export default function FutureScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Help Shape the Future</Text>
      <Text style={styles.intro}>
        These ideas are placeholders for what may come next.
      </Text>

      <View style={styles.grid}>
        {features.map((feature) => (
          <FutureFeatureCard
            avatar={feature.avatar}
            body={feature.body}
            key={feature.title}
            title={feature.title}
          />
        ))}
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/about')}
          style={({ pressed }) => [styles.feedbackCard, pressed && styles.pressed]}>
          <Image source={feedbackAvatar} style={styles.avatar} contentFit="cover" />
          <View style={styles.cardText}>
            <Text style={styles.feedbackTitle}>Feedback, Ideas, Feature Requests</Text>
            <Text style={styles.feedbackBody}>
              Have an idea, request, or launch note? Contact the developer through the{' '}
              <Text style={styles.feedbackLink}>About screen</Text>.
            </Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function FutureFeatureCard({
  avatar,
  body,
  title,
}: {
  avatar: number;
  body: string;
  title: string;
}) {
  return (
    <View style={styles.featureCard}>
      <Image source={avatar} style={styles.avatar} contentFit="cover" />
      <View style={styles.cardText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </View>
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
  featureCard: {
    minHeight: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  feedbackCard: {
    minHeight: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.28)',
    backgroundColor: aiChingColors.surface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: 'rgba(219, 226, 223, 0.08)',
  },
  cardText: {
    flex: 1,
    gap: 6,
  },
  featureTitle: {
    color: aiChingColors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  featureBody: {
    color: aiChingColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackTitle: {
    color: aiChingColors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackBody: {
    color: aiChingColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackLink: {
    color: aiChingColors.gold,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.72,
  },
});
