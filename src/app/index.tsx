import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { addCastLine, isCompleteHexagram } from '@/core/iching/generate';
import { createCompletedReading } from '@/core/iching/interpretation';
import { lookupHexagram } from '@/core/iching/lookup';
import { CompletedReading, PartialHexagramLines } from '@/core/iching/types';
import { getTodaysReading, saveCompletedReading } from '@/storage/readingsStorage';
import { aiChingColors } from '@/theme/colors';
import { getLocalDateKey } from '@/utils/date';

export default function CastScreen() {
  const router = useRouter();
  const [lines, setLines] = useState<PartialHexagramLines>([]);
  const [question, setQuestion] = useState('');
  const [todaysReading, setTodaysReading] = useState<CompletedReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getTodaysReading()
        .then(setTodaysReading)
        .finally(() => setIsLoading(false));
    }, []),
  );

  const castCount = lines.length;
  const isComplete = isCompleteHexagram(lines);

  function handleCast() {
    setLines((currentLines) => addCastLine(currentLines));
  }

  async function handleReveal() {
    if (!isCompleteHexagram(lines)) {
      return;
    }

    setIsSaving(true);
    const hexagram = lookupHexagram(lines);
    const reading = createCompletedReading({
      lines,
      hexagram,
      localDate: getLocalDateKey(),
      question,
    });

    await saveCompletedReading(reading);
    setTodaysReading(reading);
    setIsSaving(false);
    router.push('/reading');
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

  if (todaysReading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Today has been cast</Text>
          <HexagramView lines={todaysReading.lines} />
          <Text style={styles.title}>
            Hexagram {todaysReading.hexagramNumber}: {todaysReading.hexagramName}
          </Text>
          <Text style={styles.body}>Return tomorrow for a new reading.</Text>
          <CastButton label="VIEW READING" onPress={() => router.push('/reading')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.hero}>
        <View style={styles.heading}>
          <Text style={styles.kicker}>AI Ching</Text>
          <Text style={styles.title}>Cast one clear pattern for today.</Text>
        </View>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="A question or intention, optional"
          placeholderTextColor="rgba(219, 226, 223, 0.48)"
          style={styles.input}
          multiline
        />

        <HexagramView lines={lines} />

        <Text style={styles.progress}>{castCount}/6 lines cast</Text>
        <CastButton
          label={isComplete ? 'REVEAL' : 'CAST'}
          disabled={isSaving}
          onPress={isComplete ? handleReveal : handleCast}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  heading: {
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    color: aiChingColors.gold,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: aiChingColors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 360,
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.2)',
    backgroundColor: aiChingColors.surface,
    color: aiChingColors.mist,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  progress: {
    color: aiChingColors.muted,
    fontSize: 14,
  },
});
