import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { premiumQuestionConfig } from '@/config/premiumQuestion';
import { usageLimits } from '@/config/usageLimits';
import {
  generateBasicLine,
  generatePremiumCastLine,
  getCastLineDescription,
  isCompleteHexagram,
} from '@/core/iching/generate';
import { createCompletedReading } from '@/core/iching/interpretation';
import { lookupHexagram } from '@/core/iching/lookup';
import { CastLineDetail, CompletedReading, PartialHexagramLines } from '@/core/iching/types';
import {
  clearCurrentReading,
  getCurrentReading,
  getTodaysCastCount,
  saveCompletedReading,
  saveNewCompletedReading,
} from '@/storage/readingsStorage';
import { useAppTheme } from '@/theme/appTheme';
import { getCastingSoundSource } from '@/theme/castingSounds';
import { aiChingColors } from '@/theme/colors';
import { getHomeBackgroundSource } from '@/theme/hexagramBackgrounds';
import { getLocalDateKey } from '@/utils/date';

const iChingLogo = require('../../assets/images/ichinglogo.png');

export default function CastScreen() {
  const router = useRouter();
  const { freshCast } = useLocalSearchParams<{ freshCast?: string }>();
  const { appVersion, castingSoundId, entitlements, soundEffectsEnabled, themeId } = useAppTheme();
  const castLineSound = getCastingSoundSource(castingSoundId);
  const castLinePlayer = useAudioPlayer(castLineSound, { downloadFirst: true });
  const [lines, setLines] = useState<PartialHexagramLines>([]);
  const [lineCastDetails, setLineCastDetails] = useState<CastLineDetail[]>([]);
  const [latestPremiumCastNote, setLatestPremiumCastNote] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [todaysReading, setTodaysReading] = useState<CompletedReading | null>(null);
  const [todaysCastCount, setTodaysCastCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [animatedLineIndex, setAnimatedLineIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isCastingLineAnimating, setIsCastingLineAnimating] = useState(false);
  const [castButtonStep, setCastButtonStep] = useState(1);
  const [castScreenKey, setCastScreenKey] = useState(0);
  const premiumCastNoteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getCurrentReading(), getTodaysCastCount()])
        .then(([storedReading, castCountToday]) => {
          setTodaysCastCount(castCountToday);

          if (storedReading) {
            setTodaysReading(storedReading);
            return;
          }

          setTodaysReading(null);
          setLines([]);
          setLineCastDetails([]);
          setLatestPremiumCastNote(null);
          setQuestion('');
          setAnimatedLineIndex(null);
          setIsCastingLineAnimating(false);
          setCastButtonStep(1);
          setCastScreenKey((currentKey) => currentKey + 1);
        })
        .finally(() => setIsLoading(false));
    }, []),
  );

  useEffect(() => {
    if (!freshCast) {
      return;
    }

    setTodaysReading(null);
    setLines([]);
    setLineCastDetails([]);
    setLatestPremiumCastNote(null);
    setQuestion('');
    setAnimatedLineIndex(null);
    setIsCastingLineAnimating(false);
    setCastButtonStep(1);
    setCastScreenKey((currentKey) => currentKey + 1);
  }, [freshCast]);

  const castCount = lines.length;
  const basicCastsRemaining = Math.max(usageLimits.basicDailyCastLimit - todaysCastCount, 0);
  const basicLimitReached = appVersion === 'basic' && basicCastsRemaining <= 0;
  const isComplete = isCompleteHexagram(lines);
  const castButtonLabel = isComplete ? '📜 REVEAL ➤' : `➜ Cast #${castButtonStep} of 6 ➜`;
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
    const premiumCastDetail = entitlements.aiReadingsEnabled
      ? generatePremiumCastLine(nextLineIndex + 1)
      : null;
    const nextLine = premiumCastDetail?.line ?? generateBasicLine();

    setLines([...lines, nextLine]);
    if (premiumCastDetail) {
      setLineCastDetails((currentDetails) => [...currentDetails, premiumCastDetail]);
      showPremiumCastNote(getCastLineDescription(premiumCastDetail));
    }
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
      lineCastDetails: entitlements.aiReadingsEnabled ? lineCastDetails : undefined,
      hexagram,
      localDate: getLocalDateKey(),
      question: entitlements.aiReadingsEnabled ? question.trim() || undefined : undefined,
    });

    if (appVersion === 'basic') {
      await saveNewCompletedReading(reading);
      setTodaysCastCount((currentCount) => currentCount + 1);
    } else {
      await saveCompletedReading(reading);
    }
    setTodaysReading(reading);
    setIsSaving(false);
    router.push(entitlements.aiReadingsEnabled ? '/reading-premium' : '/reading');
  }

  async function handleClearCurrentReading() {
    await clearCurrentReading();
    startFreshCast();
  }

  async function handleStartAnotherBasicReading() {
    if (basicLimitReached) {
      return;
    }

    await clearCurrentReading();
    startFreshCast();
  }

  function startFreshCast() {
    setTodaysReading(null);
    setLines([]);
    setLineCastDetails([]);
    setLatestPremiumCastNote(null);
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

  function showPremiumCastNote(note: string) {
    if (premiumCastNoteTimeoutRef.current) {
      clearTimeout(premiumCastNoteTimeoutRef.current);
    }

    setLatestPremiumCastNote(note);
    premiumCastNoteTimeoutRef.current = setTimeout(() => {
      setLatestPremiumCastNote(null);
      premiumCastNoteTimeoutRef.current = null;
    }, 2000);
  }

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

  useEffect(() => {
    return () => {
      if (premiumCastNoteTimeoutRef.current) {
        clearTimeout(premiumCastNoteTimeoutRef.current);
      }
    };
  }, []);

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
          {appVersion === 'basic' ? (
            <Text style={styles.kicker}>
              {basicLimitReached ? 'Today has been cast' : `${basicCastsRemaining} reading left today`}
            </Text>
          ) : null}
          <HexagramView lines={todaysReading.lines} />
          <Text style={styles.title}>
            Hexagram {todaysReading.hexagramNumber}: {todaysReading.hexagramName}
          </Text>
          <CastButton
            label="VIEW READING"
            onPress={() => router.push(entitlements.aiReadingsEnabled ? '/reading-premium' : '/reading')}
          />
          {appVersion === 'basic' && !basicLimitReached ? (
            <Pressable
              onPress={handleStartAnotherBasicReading}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}>
              <Text style={styles.secondaryButtonText}>Cast another free reading today</Text>
            </Pressable>
          ) : null}
          {appVersion === 'basic' ? <PremiumPromoBox /> : null}
          {entitlements.aiReadingsEnabled ? (
            <Pressable
              onPress={handleClearCurrentReading}
              style={({ pressed }) => [styles.newQuestionButton, pressed && styles.newQuestionButtonPressed]}>
              <Text style={styles.newQuestionButtonText}>Start a New Question</Text>
            </Pressable>
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
            <Text style={[styles.title, styles.castPromptTitle]}>
              Hold a question, feeling, or intention in mind as you cast a hexagram!
            </Text>
          ) : (
            <View style={styles.questionBox}>
              <Text style={styles.questionLabel}>Ask the Oracle</Text>
              <TextInput
                maxLength={premiumQuestionConfig.maxLength}
                multiline
                onChangeText={setQuestion}
                placeholder="Enter a specific question if you like."
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
        {entitlements.aiReadingsEnabled && latestPremiumCastNote ? (
          <Text style={styles.premiumCastNote}>{latestPremiumCastNote}</Text>
        ) : null}
        <CastButton
          label={castButtonLabel}
          disabled={basicLimitReached || isSaving || isCastingLineAnimating}
          onPress={isComplete ? handleReveal : handleCast}
        />
        {appVersion === 'basic' ? (
          <>
            <Text style={styles.intention}>
              {basicLimitReached
                ? 'You have used your free readings for today.'
                : `${basicCastsRemaining} free reading${basicCastsRemaining === 1 ? '' : 's'} left today.`}
            </Text>
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
      <Text style={styles.premiumPromoTitle}>Want deeper readings?</Text>
      <Text style={styles.premiumPromoBody}>Go Premium to unlock more daily readings and deeper features.</Text>
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
    width: '82%',
    maxWidth: 620,
    height: 151,
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
  castPromptTitle: {
    maxWidth: '85%',
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
  newQuestionButton: {
    width: '100%',
    maxWidth: 420,
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 168, 0.66)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(138, 38, 36, 0.86)',
  },
  newQuestionButtonPressed: {
    opacity: 0.82,
  },
  newQuestionButtonText: {
    color: '#fff3ef',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  progress: {
    color: aiChingColors.muted,
    fontSize: 14,
  },
  premiumCastNote: {
    color: aiChingColors.gold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
