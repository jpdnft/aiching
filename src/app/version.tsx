import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { usageLimits } from '@/config/usageLimits';
import { AppVersion, useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';

const versionOptions: Array<{ body: string; label: string; value: AppVersion }> = [
  {
    body: 'The free version with two daily casts, static readings, and ads when ad support is enabled.',
    label: 'Basic',
    value: 'basic',
  },
  {
    body: 'The future premium version with generous daily AI-enhanced readings, ad removal, reminders, and premium themes.',
    label: 'Premium',
    value: 'premium',
  },
];

export default function VersionScreen() {
  const router = useRouter();
  const { appVersion, entitlements, setAppVersion } = useAppTheme();

  return (
    <ScreenContainer>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upgrade to Premium</Text>
          <Text style={styles.price}>$3.99 / month</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>- AI-enhanced readings shaped around your question</Text>
            <Text style={styles.featureItem}>
              - Up to {usageLimits.premiumDailyAiReadingLimit} premium AI readings per day
            </Text>
            <Text style={styles.featureItem}>- Ad-free experience</Text>
            <Text style={styles.featureItem}>- Daily reminder notifications</Text>
            <Text style={styles.featureItem}>- Premium visual themes</Text>
          </View>
          <Text style={styles.note}>
            Internet or Wi-Fi access is required for AI-enhanced reading features.
          </Text>
          <Pressable
            onPress={() => router.push('/sample')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>View Sample Premium Reading</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manage Premium</Text>
          <Text style={styles.body}>
            You can cancel your subscription through your app store subscription settings. After
            cancellation, Premium access remains available until the end of the paid billing period.
          </Text>
          <Text style={styles.note}>
            Placeholder: this will later open the correct subscription management screen for your device.
          </Text>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Cancel subscription and downgrade to Basic</Text>
          </Pressable>
        </View>
      )}

      {__DEV__ ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Development Version Toggle</Text>
          <Text style={styles.body}>
            This temporary control lets us test free and premium UI before subscriptions are connected.
          </Text>
          <View style={styles.versionOptions}>
            {versionOptions.map((option) => {
              const selected = option.value === appVersion;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setAppVersion(option.value)}
                  style={({ pressed }) => [
                    styles.versionOption,
                    selected && styles.versionOptionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.versionOptionTitle, selected && styles.versionOptionTitleSelected]}>
                    {option.label}
                  </Text>
                  <Text style={styles.versionOptionBody}>{option.body}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enabled Features</Text>
        <Text style={styles.body}>Ads: {entitlements.adsEnabled ? 'On' : 'Off'}</Text>
        <Text style={styles.body}>
          AI-enhanced readings: {entitlements.aiReadingsEnabled ? 'On' : 'Off'}
        </Text>
        <Text style={styles.body}>
          Daily reminders: {entitlements.notificationsEnabled ? 'On' : 'Off'}
        </Text>
        <Text style={styles.body}>
          Premium themes: {entitlements.premiumThemesEnabled ? 'On' : 'Off'}
        </Text>
      </View>

      <Pressable onPress={() => router.push('/more')} style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
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
    marginBottom: 24,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 8,
    marginBottom: 18,
  },
  cardTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  versionOptions: {
    gap: 10,
  },
  versionOption: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    padding: 14,
    gap: 4,
  },
  versionOptionSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
    backgroundColor: 'rgba(231, 197, 111, 0.14)',
  },
  versionOptionTitle: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  versionOptionTitleSelected: {
    color: aiChingColors.gold,
  },
  versionOptionBody: {
    color: aiChingColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  price: {
    color: aiChingColors.mist,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    color: aiChingColors.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: aiChingColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: aiChingColors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: aiChingColors.gold,
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
    borderColor: 'rgba(231, 197, 111, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.72,
  },
  backText: {
    color: aiChingColors.gold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
});
