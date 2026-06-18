import { ReactNode, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image as NativeImage, ScrollView, StyleSheet, Text, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { Image as ExpoImage } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { generateBasicLine, isCompleteHexagram } from '@/core/iching/generate';
import { createCompletedReading } from '@/core/iching/interpretation';
import { lookupHexagram } from '@/core/iching/lookup';
import { CompletedReading, PartialHexagramLines } from '@/core/iching/types';
import {
  clearTodaysReadingForDev,
  getTodaysReading,
  saveCompletedReading,
} from '@/storage/readingsStorage';
import { useAppTheme } from '@/theme/appTheme';
import { getCastingSoundSource } from '@/theme/castingSounds';
import { aiChingColors } from '@/theme/colors';
import { getHomeBackgroundSource } from '@/theme/hexagramBackgrounds';
import { getLocalDateKey } from '@/utils/date';

const iChingLogo = require('../../assets/images/ichinglogo.png');

export default function CastScreen() {
  const router = useRouter();
  const { castingSoundId, soundEffectsEnabled, themeId } = useAppTheme();
  const castLineSound = getCastingSoundSource(castingSoundId);
  const castLinePlayer = useAudioPlayer(castLineSound, { downloadFirst: true });
  const [lines, setLines] = useState<PartialHexagramLines>([]);
  const [todaysReading, setTodaysReading] = useState<CompletedReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [animatedLineIndex, setAnimatedLineIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isCastingLineAnimating, setIsCastingLineAnimating] = useState(false);
  const [castButtonStep, setCastButtonStep] = useState(1);
  const [castScreenKey, setCastScreenKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getTodaysReading()
        .then(setTodaysReading)
        .finally(() => setIsLoading(false));
    }, []),
  );

  const castCount = lines.length;
  const isComplete = isCompleteHexagram(lines);
  const castButtonLabel = isComplete ? 'REVEAL' : `Cast #${castButtonStep} of 6`;
  const homeBackgroundSource = getHomeBackgroundSource(themeId);

  useEffect(() => {
    castLinePlayer.volume = 0.42;

    setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: true,
    }).catch(() => {
      // Sound is ornamental; casting should never depend on audio setup.
    });
  }, [castLinePlayer]);

  const playCastLineSound = useCallback(() => {
    if (!soundEffectsEnabled) {
      return;
    }

    castLinePlayer
      .seekTo(0)
      .then(() => castLinePlayer.play())
      .catch(() => {
        // Keep the casting flow silent if playback is unavailable.
      });
  }, [castLinePlayer, soundEffectsEnabled]);

  function handleCast() {
    if (isCastingLineAnimating || lines.length >= 6) {
      return;
    }

    playCastLineSound();

    const nextLineIndex = lines.length;
    const nextLine = generateBasicLine();

    setLines([...lines, nextLine]);
    setAnimatedLineIndex(nextLineIndex);
    setAnimationKey((currentKey) => currentKey + 1);
    setIsCastingLineAnimating(true);
  }

  async function handleReveal() {
    if (!isCompleteHexagram(lines) || isCastingLineAnimating) {
      return;
    }

    setIsSaving(true);
    const hexagram = lookupHexagram(lines);
    const reading = createCompletedReading({
      lines,
      hexagram,
      localDate: getLocalDateKey(),
    });

    await saveCompletedReading(reading);
    setTodaysReading(reading);
    setIsSaving(false);
    router.push('/reading');
  }

  async function handleDevResetToday() {
    await clearTodaysReadingForDev();
    setTodaysReading(null);
    setLines([]);
    setAnimatedLineIndex(null);
    setIsCastingLineAnimating(false);
    setCastButtonStep(1);
    setCastScreenKey((currentKey) => currentKey + 1);
  }

  const handleLineAnimationComplete = useCallback(() => {
    setIsCastingLineAnimating(false);
    setAnimatedLineIndex(null);
    setCastButtonStep((currentStep) => Math.min(currentStep + 1, 6));
  }, []);

  useEffect(() => {
    if (!isCastingLineAnimating) {
      return;
    }

    const releaseCastButton = setTimeout(() => {
      setIsCastingLineAnimating(false);
      setAnimatedLineIndex(null);
      setCastButtonStep((currentStep) => Math.min(currentStep + 1, 6));
    }, 1200);

    return () => clearTimeout(releaseCastButton);
  }, [isCastingLineAnimating, animationKey]);

  if (isLoading) {
    return (
      <CastBackground backgroundSource={homeBackgroundSource} scrollKey="loading">
        <View style={styles.centered}>
          <ActivityIndicator color={aiChingColors.gold} />
        </View>
      </CastBackground>
    );
  }

  if (todaysReading) {
    return (
      <CastBackground backgroundSource={homeBackgroundSource} scrollKey={`today-${castScreenKey}`} showLogo>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Today has been cast</Text>
          <HexagramView lines={todaysReading.lines} />
          <Text style={styles.title}>
            Hexagram {todaysReading.hexagramNumber}: {todaysReading.hexagramName}
          </Text>
          <Text style={styles.body}>Return tomorrow for a new reading.</Text>
          <CastButton label="VIEW READING" onPress={() => router.push('/reading')} />
          {__DEV__ ? (
            <Text onPress={handleDevResetToday} style={styles.devReset}>
              Reset today for testing
            </Text>
          ) : null}
        </View>
      </CastBackground>
    );
  }

  return (
    <CastBackground backgroundSource={homeBackgroundSource} scrollKey={`cast-${castScreenKey}`} showLogo>
      <View style={styles.hero}>
        <View style={styles.heading}>
          <Text style={styles.title}>Hold a question, feeling, or intention in mind as you cast a hexagram!</Text>
        </View>

        <HexagramView
          animatedLineIndex={animatedLineIndex}
          animationKey={animationKey}
          lines={lines}
          onLineAnimationComplete={handleLineAnimationComplete}
        />

        <Text style={styles.progress}>{castCount}/6 lines cast</Text>
        <CastButton
          label={castButtonLabel}
          disabled={isSaving || isCastingLineAnimating}
          onPress={isComplete ? handleReveal : handleCast}
        />
        <Text style={styles.intention}>Careful! You can only cast one hexagram per day.</Text>
      </View>
    </CastBackground>
  );
}

function CastBackground({
  backgroundSource,
  children,
  showLogo = false,
  scrollKey,
}: {
  backgroundSource?: number;
  children: ReactNode;
  showLogo?: boolean;
  scrollKey?: string;
}) {
  return (
    <View style={styles.backgroundScreen}>
      {backgroundSource ? (
        <ExpoImage source={backgroundSource} style={styles.backgroundImage} contentFit="cover" />
      ) : null}
      <View style={styles.imageScrim} />
      <SafeAreaView style={styles.castSafeArea}>
        {showLogo ? (
          <View style={styles.logoHeader}>
            <NativeImage
              source={iChingLogo}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="I Ching"
            />
          </View>
        ) : null}
        <ScrollView key={scrollKey} contentContainerStyle={styles.castContent}>
          {children}
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
  backgroundScreen: {
    flex: 1,
    backgroundColor: aiChingColors.ink,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },
  imageScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 12, 16, 0.52)',
  },
  castSafeArea: {
    flex: 1,
  },
  castContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 126,
  },
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 8,
  },
  heading: {
    alignItems: 'center',
    gap: 12,
  },
  logoHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logo: {
    width: '96%',
    maxWidth: 620,
    height: 178,
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
  intention: {
    maxWidth: 340,
    color: aiChingColors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  progress: {
    color: aiChingColors.muted,
    fontSize: 14,
  },
  devReset: {
    color: aiChingColors.muted,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
