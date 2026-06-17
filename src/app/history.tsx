import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CompletedReading } from '@/core/iching/types';
import { getReadingHistory } from '@/storage/readingsStorage';
import { aiChingColors } from '@/theme/colors';
import { formatReadingDate } from '@/utils/date';

export default function HistoryScreen() {
  const [readings, setReadings] = useState<CompletedReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getReadingHistory()
        .then(setReadings)
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

  return (
    <ScreenContainer>
      <Text style={styles.title}>History</Text>
      {readings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your past readings will appear here.</Text>
          <Text style={styles.body}>For Phase 1, readings are saved locally on this device.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {readings.map((reading) => (
            <View key={reading.id} style={styles.card}>
              <HexagramView lines={reading.lines} size="small" />
              <View style={styles.cardText}>
                <Text style={styles.date}>{formatReadingDate(reading.localDate)}</Text>
                <Text style={styles.cardTitle}>
                  Hexagram {reading.hexagramNumber}: {reading.hexagramName}
                </Text>
                <Text style={styles.body}>{reading.theme}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 24,
  },
  empty: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: aiChingColors.mist,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  cardText: {
    gap: 6,
    alignItems: 'center',
  },
  date: {
    color: aiChingColors.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: aiChingColors.mist,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: aiChingColors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
