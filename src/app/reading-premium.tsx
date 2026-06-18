import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getHexagramByNumber } from '@/core/iching/hexagrams';
import { CompletedReading } from '@/core/iching/types';
import { getTodaysReading } from '@/storage/readingsStorage';
import { useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';
import { getHexagramBackgroundSource } from '@/theme/hexagramBackgrounds';
import { formatReadingDate } from '@/utils/date';

export default function PremiumReadingScreen() {
  const router = useRouter();
  const { entitlements, themeId } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [reading, setReading] = useState<CompletedReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getTodaysReading()
        .then((todaysReading) => {
          setReading(todaysReading);
          requestAnimationFrame(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
          });
        })
        .finally(() => setIsLoading(false));
    }, []),
  );

  if (!entitlements.aiReadingsEnabled) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.empty}>
          <Text style={styles.title}>Premium Reading</Text>
          <Text style={styles.body}>
            AI-enhanced readings are a premium feature. Manage your version to unlock them.
          </Text>
          <CastButton label="MANAGE VERSION" onPress={() => router.push('/version')} />
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator color={aiChingColors.gold} />
        </View>
      </ScreenContainer>
    );
  }

  if (!reading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.empty}>
          <Text style={styles.title}>No premium reading yet</Text>
          <Text style={styles.body}>Cast a hexagram to prepare an AI-enhanced reading.</Text>
          <CastButton label="CAST" onPress={() => router.push('/')} />
        </View>
      </ScreenContainer>
    );
  }

  const hexagram = getHexagramByNumber(reading.hexagramNumber);
  const backgroundSource = getHexagramBackgroundSource(reading.hexagramNumber, themeId);
  const askedQuestion = reading.question?.trim();

  return (
    <View style={styles.backgroundScreen}>
      {backgroundSource ? (
        <Image source={backgroundSource} style={styles.backgroundImage} contentFit="cover" />
      ) : null}
      <View style={styles.imageScrim} />
      <SafeAreaView style={styles.readingSafeArea}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.readingContent}>
          <View style={styles.header}>
            <HexagramView lines={reading.lines} size="small" />
            <Text style={styles.date}>{formatReadingDate(reading.localDate)}</Text>
            <Text style={styles.title}>
              Premium Reading: Hexagram {reading.hexagramNumber}: {reading.hexagramName}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{askedQuestion ? 'Your Question' : 'General Outlook'}</Text>
            <Text style={styles.body}>
              {askedQuestion ??
                'You did not ask any particular question, so your reading will reflect a general outlook for you, much like a horoscope might provide.'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Reading Space</Text>
            <Text style={styles.body}>
              This page is reserved for the premium AI-enhanced interpretation flow. It will use your
              question, this hexagram, and the app&apos;s structured I Ching data to create a one-time
              personalized reading.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{hexagram.name}: Foundation</Text>
            <Text style={styles.body}>{reading.basicInterpretation}</Text>
            <Text style={styles.promptTitle}>Today&apos;s Prompt</Text>
            <Text style={styles.body}>{reading.reflectionPrompt}</Text>
          </View>

          <Pressable
            onPress={() => router.push('/reading')}
            style={({ pressed }) => [styles.secondaryLink, pressed && styles.pressed]}>
            <Text style={styles.secondaryLinkText}>View basic reading page</Text>
          </Pressable>

          <CastButton label="RETURN TO CAST" onPress={() => router.push('/')} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  backgroundScreen: {
    flex: 1,
    backgroundColor: aiChingColors.ink,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },
  imageScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 12, 16, 0.58)',
  },
  readingSafeArea: {
    flex: 1,
  },
  readingContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 112,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
    width: '100%',
  },
  date: {
    color: aiChingColors.gold,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 640,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 19, 24, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.18)',
    padding: 18,
    gap: 10,
    marginBottom: 18,
  },
  cardTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  promptTitle: {
    color: aiChingColors.gold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
  },
  secondaryLink: {
    marginBottom: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryLinkText: {
    color: aiChingColors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.72,
  },
});
