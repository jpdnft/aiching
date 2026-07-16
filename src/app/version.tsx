import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { usageLimits } from '@/config/usageLimits';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const premiumOracleImage = require('@/assets/hexagrams/themes/02/mountain_strategist.jpg');

export default function VersionScreen() {
  const router = useRouter();
  const styles = useVersionStyles();
  const {
    appVersion,
    manageSubscription,
    presentPaywall,
    restorePurchases,
    revenueCat,
  } = useAppTheme();
  const [isSubscriptionActionRunning, setIsSubscriptionActionRunning] = useState(false);

  async function runSubscriptionAction(action: () => Promise<void>) {
    if (isSubscriptionActionRunning) {
      return;
    }

    setIsSubscriptionActionRunning(true);

    try {
      await action();
    } finally {
      setIsSubscriptionActionRunning(false);
    }
  }

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>Manage Version</Text>
      <Text style={styles.intro}>
        Select and manage your version of this app.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Version</Text>
        <Text style={styles.body}>
          You are currently using the {appVersion === 'premium' ? 'Premium' : 'Basic'} version.
        </Text>
      </View>

      {appVersion === 'basic' ? (
        <View style={[styles.card, styles.premiumOfferCard]}>
          <View style={styles.offerHero}>
            <View style={styles.offerCopy}>
              <Text style={styles.offerKicker}>Premium Oracle</Text>
              <Text style={styles.offerTitle}>Upgrade to Premium</Text>
              <Text style={styles.price}>$3.99 / month</Text>
            </View>
            <Image source={premiumOracleImage} style={styles.offerImage} contentFit="cover" />
          </View>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>
              - Impossibly detailed Oracle-powered readings shaped around your specific question
            </Text>
            <Text style={styles.featureItem}>
              - Changing lines powered by traditional casting logic, with full interpretations
            </Text>
            <Text style={styles.featureDetail}>
              Changing lines show where your situation is in motion and what it may be turning toward.
            </Text>
            <Text style={styles.featureItem}>
              - Up to {usageLimits.premiumDailyAiReadingLimit} full oracle-powered readings per day
            </Text>
            <Text style={styles.featureItem}>- Totally ad-free experience</Text>
            <Text style={styles.featureItem}>- Configurable daily reminder notifications</Text>
            <Text style={styles.featureItem}>- Premium visual themes</Text>
          </View>
          <Text style={styles.note}>
            Internet or Wi-Fi access is required for oracle-powered reading features.
          </Text>
          <Pressable
            onPress={() => router.push('/sample')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>View Sample Premium Reading</Text>
          </Pressable>
          <Pressable
            onPress={() => runSubscriptionAction(presentPaywall)}
            style={({ pressed }) => [
              styles.primaryButton,
              isSubscriptionActionRunning && styles.disabledButton,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.primaryButtonText}>
              {isSubscriptionActionRunning ? 'Opening...' : 'Upgrade to Premium'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => runSubscriptionAction(restorePurchases)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
          </Pressable>
          <RevenueCatStatusNote availability={revenueCat.availability} errorMessage={revenueCat.errorMessage} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manage Premium</Text>
          <Text style={styles.body}>
            You can cancel your subscription through your app store subscription settings. After
            cancellation, Premium access remains available until the end of the paid billing period.
          </Text>
          <Text style={styles.note}>
            You can manage your Premium subscription through the subscription tools for your device.
          </Text>
          <Pressable
            onPress={() => runSubscriptionAction(manageSubscription)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>
              {isSubscriptionActionRunning ? 'Opening...' : 'Manage Subscription'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => runSubscriptionAction(restorePurchases)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
          </Pressable>
          <RevenueCatStatusNote availability={revenueCat.availability} errorMessage={revenueCat.errorMessage} />
        </View>
      )}

      <Pressable onPress={() => router.push('/more')} style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
        <Text style={styles.backText}>Back to More</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function RevenueCatStatusNote({
  availability,
  errorMessage,
}: {
  availability: string;
  errorMessage?: string;
}) {
  const styles = useVersionStyles();

  if (availability === 'configured') {
    return null;
  }

  const note =
    availability === 'unsupported_platform'
      ? 'Subscription purchases require the Android app build. iOS is planned for a future version.'
      : availability === 'not_configured'
        ? 'Subscription purchases are not configured yet. Add the RevenueCat Android public API key to enable the live paywall.'
        : `Subscription purchases are currently unavailable.${errorMessage ? ` ${errorMessage}` : ''}`;

  return <Text style={styles.note}>{note}</Text>;
}

function useVersionStyles() {
  const { colorMode } = useAppTheme();

  return createVersionStyles(getAiChingColors(colorMode), colorMode);
}

function createVersionStyles(colors: AiChingColorPalette, colorMode: 'dark' | 'light') {
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
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    padding: 18,
    gap: 8,
    marginBottom: 18,
  },
  premiumOfferCard: {
    borderColor: 'rgba(139, 93, 29, 0.54)',
    backgroundColor: colorMode === 'dark' ? 'rgba(33, 27, 13, 0.72)' : '#fff4d8',
    shadowColor: '#e7c56f',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  offerKicker: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(231, 197, 111, 0.16)',
    color: colors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  offerTitle: {
    color: colors.mist,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  offerHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  offerCopy: {
    flex: 1,
    gap: 8,
  },
  offerImage: {
    width: '42%',
    maxWidth: 180,
    minWidth: 120,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.44)',
    backgroundColor: colors.inkSoft,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  price: {
    color: colors.mist,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    color: colors.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  featureDetail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: -2,
    paddingLeft: 12,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  disabledButton: {
    opacity: 0.62,
  },
  primaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  backLink: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.28)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.72,
  },
  backText: {
    color: colors.gold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  });
}
