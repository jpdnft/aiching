import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image as NativeImage,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  const { appVersion, castingSoundId, entitlements, soundEffectsEnabled, themeId } = useAppTheme();
  const castLineSound = getCastingSoundSource(castingSoundId);
  const castLinePlayer = useAudioPlayer(castLineSound, { downloadFirst: true });
  const [lines, setLines] = useState<PartialHexagramLines>([]);
  const [question, setQuestion] = useState('');
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
      question: entitlements.aiReadingsEnabled ? question.trim() || undefined : undefined,
    });

    await saveCompletedReading(reading);
    setTodaysReading(reading);
    setIsSaving(false);
    router.push(entitlements.aiReadingsEnabled ? '/reading-premium' : '/reading');
  }

  async function handleDevResetToday() {
    await clearTodaysReadingForDev();
    setTodaysReading(null);
    setLines([]);
    setQuestion('');
    setAnimatedLineIndex(null);
    setIsCastingLineAnimating(false);
    setCastButtonStep(1);
    setCastScreenKey((currentKey) => currentKey + 1);
  }

  async function handleClearCurrentReading() {
    await clearTodaysReadingForDev();
    setTodaysReading(null);
    setLines([]);
    setQuestion('');
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
          {appVersion === 'basic' ? <Text style={styles.kicker}>Today has been cast</Text> : null}
          <HexagramView lines={todaysReading.lines} />
          <Text style={styles.title}>
            Hexagram {todaysReading.hexagramNumber}: {todaysReading.hexagramName}
          </Text>
          <CastButton
            label="VIEW READING"
            onPress={() => router.push(entitlements.aiReadingsEnabled ? '/reading-premium' : '/reading')}
          />
          {appVersion === 'basic' ? <PremiumPromoBox /> : null}
          {entitlements.unlimitedCastingEnabled ? (
            <Pressable
              onPress={handleClearCurrentReading}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}>
              <Text style={styles.secondaryButtonText}>Clear current hexagram and ask new question</Text>
            </Pressable>
          ) : null}
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
          {appVersion === 'basic' ? (
            <Text style={styles.title}>Hold a question, feeling, or intention in mind as you cast a hexagram!</Text>
          ) : (
            <View style={styles.questionBox}>
              <Text style={styles.questionLabel}>Optional Question</Text>
              <TextInput
                multiline
                onChangeText={setQuestion}
                placeholder="What would you like to ask?"
                placeholderTextColor="rgba(219, 226, 223, 0.52)"
                style={styles.questionInput}
                textAlignVertical="top"
                value={question}
              />
            </View>
          )}
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
        {appVersion === 'basic' ? (
          <>
            <Text style={styles.intention}>Careful! You can only cast one hexagram per day.</Text>
            <PremiumPromoBox />
          </>
        ) : null}
      </View>
    </CastBackground>
  );
}

function PremiumPromoBox() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/version')}
      style={({ pressed }) => [styles.premiumPromo, pressed && styles.premiumPromoPressed]}>
      <Text style={styles.premiumPromoTitle}>Want unlimited readings?</Text>
      <Text style={styles.premiumPromoBody}>Go Premium to unlock more readings and deeper features.</Text>
      <Text style={styles.premiumPromoLink}>View premium features</Text>
    </Pressable>
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
  questionBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.22)',
    backgroundColor: 'rgba(16, 19, 24, 0.72)',
    padding: 14,
    gap: 8,
  },
  questionLabel: {
    color: aiChingColors.gold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  questionInput: {
    minHeight: 92,
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 23,
    padding: 0,
  },
  intention: {
    maxWidth: 340,
    color: aiChingColors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  premiumPromo: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
    backgroundColor: 'rgba(16, 19, 24, 0.76)',
    padding: 16,
    gap: 6,
  },
  premiumPromoPressed: {
    opacity: 0.78,
  },
  premiumPromoTitle: {
    color: aiChingColors.gold,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  premiumPromoBody: {
    color: aiChingColors.mist,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  premiumPromoLink: {
    color: aiChingColors.gold,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    width: '100%',
    maxWidth: 420,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(16, 19, 24, 0.64)',
  },
  secondaryButtonPressed: {
    opacity: 0.78,
  },
  secondaryButtonText: {
    color: aiChingColors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
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
