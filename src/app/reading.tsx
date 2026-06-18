import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CastButton } from '@/components/CastButton';
import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getHexagramByNumber } from '@/core/iching/hexagrams';
import { CompletedReading, Hexagram, HexagramRelationship } from '@/core/iching/types';
import { getTodaysReading } from '@/storage/readingsStorage';
import { ReadingTextSize, useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';
import { getHexagramBackgroundSource } from '@/theme/hexagramBackgrounds';
import { formatReadingDate } from '@/utils/date';

export default function ReadingScreen() {
  const router = useRouter();
  const { readingTextSize, themeId } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [reading, setReading] = useState<CompletedReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const readingTextStyles = useMemo(
    () => getReadingTextStyles(readingTextSize),
    [readingTextSize],
  );

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTodaysReading()
        .then((todaysReading) => {
          setReading(todaysReading);
          scrollToTop();
        })
        .finally(() => setIsLoading(false));
    }, [scrollToTop]),
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

  const hexagram = getHexagramByNumber(reading.hexagramNumber);
  const backgroundSource = getHexagramBackgroundSource(reading.hexagramNumber, themeId);
  const reversedHexagram = getHexagramByNumber(hexagram.relationships.reversed.number);
  const oppositeHexagram = getHexagramByNumber(hexagram.relationships.opposite.number);

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
              Hexagram {reading.hexagramNumber}: {reading.hexagramName}
            </Text>
          </View>

          <View style={styles.readingPanel}>
            <PrimaryReadingPanel
              imageSource={backgroundSource}
              hexagram={hexagram}
              textStyles={readingTextStyles}
              theme={reading.theme}
              reflection={reading.basicInterpretation}
            />

            <RelationshipPanel
              title="Other Side - Your question as viewed by others, or perhaps when looking back afterward"
              relationship={hexagram.relationships.reversed}
              relatedHexagram={reversedHexagram}
              textStyles={readingTextStyles}
            />

            <RelationshipPanel
              title="Complementary View - What Your Situation is Not."
              relationship={hexagram.relationships.opposite}
              relatedHexagram={oppositeHexagram}
              textStyles={readingTextStyles}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today&apos;s Prompt</Text>
              {backgroundSource ? (
                <View style={styles.promptImageFrame}>
                  <Image
                    source={backgroundSource}
                    style={styles.promptImage}
                    contentFit="cover"
                    contentPosition="left"
                  />
                </View>
              ) : null}
              <Text style={[styles.body, readingTextStyles.body]}>{reading.reflectionPrompt}</Text>
            </View>
          </View>

          <CastButton label="RETURN TO CAST" onPress={() => router.push('/')} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PrimaryReadingPanel({
  hexagram,
  imageSource,
  textStyles,
  theme,
  reflection,
}: {
  hexagram: Hexagram;
  imageSource?: number;
  textStyles: ReadingTextStyles;
  theme: string;
  reflection: string;
}) {
  return (
    <View style={styles.primarySection}>
      <View style={styles.primaryImageFrame}>
        {imageSource ? (
          <Image source={imageSource} style={styles.primaryImage} contentFit="cover" contentPosition="left" />
        ) : null}
      </View>
      <View style={styles.primaryText}>
        <ReadingMeter label="Caution / Challenging" score={hexagram.cautionScore} tone="caution" />
        <ReadingMeter label="Supportive / Favorable" score={hexagram.supportScore} tone="support" />
        <Text style={styles.sectionTitle}>{hexagram.name}: Theme</Text>
        <Text style={[styles.relationshipBody, textStyles.relationshipBody]}>{theme}</Text>
        <Text style={styles.sectionTitle}>{hexagram.name}: Reflection</Text>
        <Text style={[styles.relationshipBody, textStyles.relationshipBody]}>{reflection}</Text>
        <Text style={styles.sectionTitle}>{hexagram.name}: Momentum</Text>
        <View style={styles.keywordRow}>
          {hexagram.momentum.map((momentum) => (
            <Text key={momentum} style={styles.momentumChip}>
              {formatLabel(momentum)}
            </Text>
          ))}
        </View>
        {hexagram.momentumNotes.map((note) => (
          <Text key={note} style={[styles.relationshipBody, textStyles.relationshipBody]}>
            {note}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ReadingMeter({
  label,
  score,
  tone,
}: {
  label: string;
  score: number;
  tone: 'caution' | 'support';
}) {
  const activeColor = tone === 'caution' ? aiChingColors.danger : aiChingColors.gold;

  return (
    <View style={styles.meterRow}>
      <Text style={styles.meterLabel}>{label}</Text>
      <View style={styles.meterBlocks} accessibilityLabel={`${label}: ${score} out of 10`}>
        {Array.from({ length: 10 }, (_, index) => {
          const active = index < score;

          return (
            <View
              key={`${label}-${index}`}
              style={[
                styles.meterBlock,
                active && {
                  backgroundColor: activeColor,
                  borderColor: activeColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

function RelationshipPanel({
  title,
  relationship,
  relatedHexagram,
  textStyles,
}: {
  title: string;
  relationship: HexagramRelationship;
  relatedHexagram: Hexagram;
  textStyles: ReadingTextStyles;
}) {
  return (
    <View style={styles.relationshipSection}>
      <View style={styles.relationshipVisual}>
        <HexagramView lines={relatedHexagram.lineStates} size="tiny" />
      </View>
      <View style={styles.relationshipText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.relatedTitle, textStyles.relatedTitle]}>
          Hexagram {relatedHexagram.number}: {relatedHexagram.name}
        </Text>
        {relationship.sameAsPrimary ? <Text style={styles.sameNote}>unchanged when turned</Text> : null}
        <Text style={[styles.relationshipBody, textStyles.relationshipBody]}>{relationship.theme}</Text>
        <Text style={[styles.relationshipBody, textStyles.relationshipBody]}>{relationship.reflection}</Text>
        <Text style={styles.applicationTitle}>Try This</Text>
        <Text style={[styles.relationshipBody, textStyles.relationshipBody]}>
          {relationship.applicationPrompt}
        </Text>
      </View>
    </View>
  );
}

type ReadingTextStyles = {
  body: TextStyle;
  relatedTitle: TextStyle;
  relationshipBody: TextStyle;
};

function getReadingTextStyles(textSize: ReadingTextSize): ReadingTextStyles {
  if (textSize === 'extraLarge') {
    return {
      body: {
        fontSize: 20,
        lineHeight: 31,
      },
      relatedTitle: {
        fontSize: 20,
        lineHeight: 28,
      },
      relationshipBody: {
        fontSize: 19,
        lineHeight: 29,
      },
    };
  }

  if (textSize === 'large') {
    return {
      body: {
        fontSize: 18,
        lineHeight: 28,
      },
      relatedTitle: {
        fontSize: 18,
        lineHeight: 25,
      },
      relationshipBody: {
        fontSize: 17,
        lineHeight: 26,
      },
    };
  }

  return {
    body: {},
    relatedTitle: {},
    relationshipBody: {},
  };
}

function formatLabel(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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
  section: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 18,
    marginBottom: 22,
    gap: 10,
    alignItems: 'center',
  },
  primarySection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 18,
    marginBottom: 22,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  primaryImageFrame: {
    width: 88,
    height: 118,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.28)',
    backgroundColor: 'rgba(16, 19, 24, 0.42)',
  },
  primaryImage: {
    width: '100%',
    height: '100%',
  },
  promptImageFrame: {
    width: '100%',
    maxWidth: 264,
    aspectRatio: 9 / 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.28)',
    backgroundColor: 'rgba(16, 19, 24, 0.42)',
  },
  promptImage: {
    width: '100%',
    height: '100%',
  },
  primaryText: {
    flex: 1,
    gap: 8,
  },
  meterRow: {
    gap: 6,
    marginBottom: 2,
  },
  meterLabel: {
    color: aiChingColors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  meterBlocks: {
    flexDirection: 'row',
    gap: 3,
  },
  meterBlock: {
    width: 9,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.2)',
    backgroundColor: 'rgba(219, 226, 223, 0.12)',
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  momentumChip: {
    color: aiChingColors.ink,
    backgroundColor: aiChingColors.gold,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  relationshipSection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 197, 111, 0.16)',
    paddingTop: 18,
    marginBottom: 22,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  relationshipVisual: {
    paddingTop: 2,
  },
  relationshipText: {
    flex: 1,
    gap: 7,
  },
  relatedTitle: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  sameNote: {
    color: aiChingColors.muted,
    fontSize: 12,
    lineHeight: 17,
    textTransform: 'uppercase',
  },
  relationshipBody: {
    color: aiChingColors.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  applicationTitle: {
    color: aiChingColors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  readingPanel: {
    width: '100%',
    maxWidth: 640,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 19, 24, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.18)',
    padding: 18,
    marginBottom: 24,
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
