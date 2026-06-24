import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';

export default function ReviewAccessScreen() {
  const router = useRouter();
  const { clearReviewAccess, enableReviewAccess, reviewAccessEnabled } = useAppTheme();
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function submitReviewAccess() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await enableReviewAccess(accessCode);

      if (result.granted) {
        setAccessCode('');
        setMessage('Reviewer access enabled. Premium features are now available.');
      } else {
        setMessage(result.message ?? 'Reviewer access was not granted.');
      }
    } catch {
      setMessage('Reviewer access is unavailable right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function disableReviewAccess() {
    await clearReviewAccess();
    setMessage('Reviewer access disabled.');
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Reviewer Access</Text>
      <Text style={styles.intro}>
        App reviewers can use the access code supplied in Play Console to review Premium features
        without creating an account or making a purchase.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {reviewAccessEnabled ? 'Reviewer Access Enabled' : 'Sign In as Reviewer'}
        </Text>
        <Text style={styles.body}>
          {reviewAccessEnabled
            ? 'Premium features are available on this device for review and testing.'
            : 'Enter the reviewer access code, then continue through the app normally.'}
        </Text>

        {reviewAccessEnabled ? (
          <Pressable
            onPress={disableReviewAccess}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Disable Reviewer Access</Text>
          </Pressable>
        ) : (
          <>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setAccessCode}
              placeholder="Access code"
              placeholderTextColor="rgba(244, 233, 213, 0.45)"
              secureTextEntry
              style={styles.input}
              value={accessCode}
            />
            <Pressable
              onPress={submitReviewAccess}
              style={({ pressed }) => [
                styles.primaryButton,
                isSubmitting && styles.disabledButton,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? 'Checking...' : 'Sign In as Reviewer'}
              </Text>
            </Pressable>
          </>
        )}

        {message ? <Text style={styles.note}>{message}</Text> : null}
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
    gap: 12,
    marginBottom: 18,
  },
  cardTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  note: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  input: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.24)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  disabledButton: {
    opacity: 0.62,
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
