import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const features = [
  {
    title: 'Dramatic Readings with Voice',
    body: 'If high-quality generated voice costs come down, we would *love* to explore generatin dramatic audio readings for premium users. Right now, the tech is there for sure, but the costs are too high to offer this at scale.',
    avatar: require('@/assets/hexagrams/themes/01/storm_witch.jpg'),
  },
  {
    title: 'iOS Version',
    body: 'For launch, we are starting with Google Play. An iPhone and iPad version is on the roadmap once the app earns enough to justify Apple developer program costs. (I\'m a solo developer, not some huge app company, so I have to be careful about costs and time.)',
    avatar: require('@/assets/hexagrams/themes/03/lantern_oracle.jpg'),
  },
  {
    title: 'Interactive chat about your reading',
    body: 'A future conversational layer for gentle follow-up questions. While I would love to enable this, it is not on the immediate roadmap because of the high costs of LLM-based chat services at scale. But, who knows? If the app takes off, maybe we can make this happen soon.',
    avatar: require('@/assets/hexagrams/themes/02/star_cartographer.jpg'),
  },
  {
    title: 'Pattern insights',
    body: 'Themes across readings over time, once history is more mature. I think this one is very doable in the near-term, but it will require a lot of careful design and testing to make sure it is useful and not just noise.',
    avatar: require('@/assets/hexagrams/themes/03/dream_librarian.jpg'),
  },
];

const feedbackAvatar = require('@/assets/hexagrams/themes/02/tea_house_auntie.jpg');

export default function FutureScreen() {
  const router = useRouter();
  const styles = useFutureStyles();

  return (
    <ScreenContainer themeAware>
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
              Have an idea, feature request, or launch note? Contact the developer through the{' '}
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
  const styles = useFutureStyles();

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

function useFutureStyles() {
  const { colorMode } = useAppTheme();

  return createFutureStyles(getAiChingColors(colorMode));
}

function createFutureStyles(colors: AiChingColorPalette) {
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
    marginBottom: 24,
  },
  grid: {
    gap: 12,
  },
  featureCard: {
    minHeight: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  feedbackCard: {
    minHeight: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.32)',
    backgroundColor: colors.surface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
  },
  cardText: {
    flex: 1,
    gap: 6,
  },
  featureTitle: {
    color: colors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  featureBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackTitle: {
    color: colors.mist,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackLink: {
    color: colors.gold,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.72,
  },
  });
}
