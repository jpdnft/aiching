import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CompletedReading } from '@/core/iching/types';
import { getTodaysReading } from '@/storage/readingsStorage';
import { aiChingColors } from '@/theme/colors';
import { formatReadingDate } from '@/utils/date';

export default function ReadingScreen() {
  const router = useRouter();
  const [reading, setReading] = useState<CompletedReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getTodaysReading()
        .then(setReading)
        .finally(() => setIsLoading(false));
    }, []),
  );

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
          <Text style={styles.title}>No reading yet today</Text>
          <Text style={styles.body}>Cast six lines to reveal today&apos;s reflection.</Text>
          <CastButton label="CAST" onPress={() => router.push('/')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <HexagramView lines={reading.lines} size="small" />
        <Text style={styles.date}>{formatReadingDate(reading.localDate)}</Text>
        <Text style={styles.title}>
          Hexagram {reading.hexagramNumber}: {reading.hexagramName}
        </Text>
        {reading.question ? <Text style={styles.question}>{reading.question}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.body}>{reading.theme}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reflection</Text>
        <Text style={styles.body}>{reading.basicInterpretation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Prompt</Text>
        <Text style={styles.body}>{reading.reflectionPrompt}</Text>
      </View>

      <CastButton label="RETURN TO CAST" onPress={() => router.push('/')} />
    </ScreenContainer>
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
  },
  header: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
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
  question: {
    color: aiChingColors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 18,
    marginBottom: 22,
    gap: 8,
  },
  sectionTitle: {
    color: aiChingColors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
  },
});
