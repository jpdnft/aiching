import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';

import { HexagramView } from '@/components/HexagramView';
import { PremiumReadingText } from '@/components/PremiumReadingText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CompletedReading } from '@/core/iching/types';
import { clearReadingHistory, deleteReadingFromHistory, getReadingHistory } from '@/storage/readingsStorage';
import { ReadingTextSize, useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';
import { getHexagramBackgroundSource } from '@/theme/hexagramBackgrounds';
import { formatReadingDate } from '@/utils/date';

export default function HistoryScreen() {
  const { colorMode, readingTextSize, themeId } = useAppTheme();
  const styles = useHistoryStyles();
  const colors = getAiChingColors(colorMode);
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);
  const [deleteConfirmReadingId, setDeleteConfirmReadingId] = useState<string | null>(null);
  const [expandedReadingIds, setExpandedReadingIds] = useState<string[]>([]);
  const [readings, setReadings] = useState<CompletedReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleReadingCount, setVisibleReadingCount] = useState(historyPageSize);
  const historyTextStyles = useMemo(
    () => getHistoryTextStyles(readingTextSize),
    [readingTextSize],
  );

  useFocusEffect(
    useCallback(() => {
      getReadingHistory()
        .then(setReadings)
        .finally(() => setIsLoading(false));
    }, []),
  );

  const filteredReadings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return readings;
    }

    return readings.filter((reading) => getReadingSearchText(reading).includes(query));
  }, [readings, searchQuery]);
  const visibleReadings = filteredReadings.slice(0, visibleReadingCount);
  const hiddenReadingCount = Math.max(filteredReadings.length - visibleReadings.length, 0);
  const hasMoreReadings = hiddenReadingCount > 0;

  function handleSearchQueryChange(query: string) {
    setSearchQuery(query);
    setVisibleReadingCount(historyPageSize);
    setExpandedReadingIds([]);
  }

  function toggleExpanded(readingId: string) {
    setExpandedReadingIds((currentIds) =>
      currentIds.includes(readingId)
        ? currentIds.filter((currentId) => currentId !== readingId)
        : [...currentIds, readingId],
    );
  }

  function handleClearHistory() {
    if (readings.length === 0) {
      return;
    }

    setClearConfirmVisible(true);
  }

  async function confirmClearHistory() {
    await clearReadingHistory();
    setReadings([]);
    setExpandedReadingIds([]);
    setSearchQuery('');
    setVisibleReadingCount(historyPageSize);
    setClearConfirmVisible(false);
  }

  function handleDeleteReading(readingId: string) {
    setDeleteConfirmReadingId(readingId);
  }

  async function confirmDeleteReading(readingId: string) {
    await deleteReadingFromHistory(readingId);
    setReadings((currentReadings) => currentReadings.filter((entry) => entry.id !== readingId));
    setExpandedReadingIds((currentIds) => currentIds.filter((entryId) => entryId !== readingId));
    setDeleteConfirmReadingId(null);
  }

  if (isLoading) {
    return (
      <ScreenContainer scroll={false} themeAware>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer themeAware>
      <View style={styles.headerRow}>
        <Text style={styles.title}>History</Text>
        <Pressable
          disabled={readings.length === 0}
          onPress={handleClearHistory}
          style={({ pressed }) => [
            styles.clearButton,
            readings.length === 0 && styles.clearButtonDisabled,
            pressed && readings.length > 0 && styles.expandButtonPressed,
          ]}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </Pressable>
      </View>
      <Text style={styles.policyNote}>
        You can keep up to 1,000 past readings on this device. After that, the oldest saved readings
        are automatically removed as new readings are added.
      </Text>
      {clearConfirmVisible ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>Clear all saved readings?</Text>
          <Text style={styles.confirmBody}>This deletes all saved readings and premium answers from this device.</Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={() => setClearConfirmVisible(false)}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.expandButtonPressed]}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={confirmClearHistory}
              style={({ pressed }) => [styles.confirmDeleteButton, pressed && styles.expandButtonPressed]}>
              <Text style={styles.confirmDeleteButtonText}>Clear History</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      <View style={styles.searchBox}>
        <TextInput
          onChangeText={handleSearchQueryChange}
          placeholder="Search questions, answers, hexagrams..."
          placeholderTextColor={colorMode === 'dark' ? 'rgba(219, 226, 223, 0.52)' : 'rgba(111, 102, 89, 0.72)'}
          style={styles.searchInput}
          value={searchQuery}
        />
      </View>
      {readings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your past readings will appear here.</Text>
          <Text style={[styles.body, historyTextStyles.body]}>
            Readings and premium answers are saved locally on this device.
          </Text>
        </View>
      ) : filteredReadings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No readings match that search.</Text>
          <Text style={[styles.body, historyTextStyles.body]}>
            Try a hexagram name, question, answer phrase, or reader voice.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          <Text style={styles.resultCount}>
            Showing {visibleReadings.length} of {filteredReadings.length} reading
            {filteredReadings.length === 1 ? '' : 's'}
          </Text>
          {visibleReadings.map((reading) => {
            const backgroundSource = getHexagramBackgroundSource(
              reading.hexagramNumber,
              themeId,
            );
            const askedQuestion = reading.question?.trim();
            const premiumReading = reading.premiumReading;
            const isExpanded = expandedReadingIds.includes(reading.id);

            return (
              <View key={reading.id} style={styles.card}>
                {backgroundSource ? (
                  <Image source={backgroundSource} style={styles.cardImage} contentFit="cover" />
                ) : null}
                <View style={styles.cardScrim} />
                <View style={styles.cardContent}>
                  {backgroundSource ? (
                    <Image source={backgroundSource} style={styles.lightCardThumbnail} contentFit="cover" />
                  ) : null}
                  <View style={styles.hexagramSeal}>
                    <HexagramView colorModeOverride="dark" lines={reading.lines} size="small" />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.date}>{formatReadingDate(reading.localDate)}</Text>
                    <Text style={styles.cardTitle}>
                      Hexagram {reading.hexagramNumber}: {reading.hexagramName}
                    </Text>
                    <Text style={[styles.cardBody, historyTextStyles.cardBody]}>{reading.theme}</Text>
                    {askedQuestion ? (
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>Question</Text>
                        <Text style={[styles.detailText, historyTextStyles.detailText]}>{askedQuestion}</Text>
                      </View>
                    ) : null}
                    {premiumReading ? (
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>
                          Premium Answer by {premiumReading.personalityName}
                        </Text>
                        {isExpanded ? (
                          <PremiumReadingText
                            compact
                            headingStyle={[styles.premiumHeading, historyTextStyles.premiumHeading]}
                            text={premiumReading.text}
                            textStyle={[styles.premiumText, historyTextStyles.premiumText]}
                          />
                        ) : (
                          <Text style={[styles.detailText, historyTextStyles.detailText]}>
                            {getExcerpt(premiumReading.text)}
                          </Text>
                        )}
                        {premiumReading.text.length > historyExcerptLength ? (
                          <Pressable
                            onPress={() => toggleExpanded(reading.id)}
                            style={({ pressed }) => [styles.expandButton, pressed && styles.expandButtonPressed]}>
                            <Text style={styles.expandButtonText}>
                              {isExpanded ? 'Show Less' : 'Read Full Answer'}
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>
                    ) : null}
                    {deleteConfirmReadingId === reading.id ? (
                      <View style={styles.inlineConfirm}>
                        <Text style={[styles.confirmBody, styles.inlineConfirmBody]}>Delete this entry?</Text>
                        <View style={styles.confirmActions}>
                          <Pressable
                            onPress={() => setDeleteConfirmReadingId(null)}
                            style={({ pressed }) => [styles.cancelButton, pressed && styles.expandButtonPressed]}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => confirmDeleteReading(reading.id)}
                            style={({ pressed }) => [styles.confirmDeleteButton, pressed && styles.expandButtonPressed]}>
                            <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleDeleteReading(reading.id)}
                        style={({ pressed }) => [styles.deleteButton, pressed && styles.expandButtonPressed]}>
                        <Text style={styles.deleteButtonText}>Delete Entry</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
          {hasMoreReadings ? (
            <Pressable
              onPress={() => setVisibleReadingCount((currentCount) => currentCount + historyPageSize)}
              style={({ pressed }) => [styles.loadMoreButton, pressed && styles.expandButtonPressed]}>
              <Text style={styles.loadMoreButtonText}>
                Load {Math.min(historyPageSize, hiddenReadingCount)} More
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </ScreenContainer>
  );
}

const historyExcerptLength = 360;
const historyPageSize = 25;

type HistoryTextStyles = {
  body: TextStyle;
  cardBody: TextStyle;
  detailText: TextStyle;
  premiumHeading: TextStyle;
  premiumText: TextStyle;
};

function getHistoryTextStyles(textSize: ReadingTextSize): HistoryTextStyles {
  if (textSize === 'extraLarge') {
    return {
      body: {
        fontSize: 19,
        lineHeight: 29,
      },
      cardBody: {
        fontSize: 19,
        lineHeight: 29,
      },
      detailText: {
        fontSize: 18,
        lineHeight: 27,
      },
      premiumHeading: {
        fontSize: 19,
        lineHeight: 26,
      },
      premiumText: {
        fontSize: 18,
        lineHeight: 27,
      },
    };
  }

  if (textSize === 'large') {
    return {
      body: {
        fontSize: 17,
        lineHeight: 26,
      },
      cardBody: {
        fontSize: 17,
        lineHeight: 26,
      },
      detailText: {
        fontSize: 16,
        lineHeight: 24,
      },
      premiumHeading: {
        fontSize: 17,
        lineHeight: 23,
      },
      premiumText: {
        fontSize: 16,
        lineHeight: 24,
      },
    };
  }

  return {
    body: {},
    cardBody: {},
    detailText: {},
    premiumHeading: {},
    premiumText: {},
  };
}

function getExcerpt(text: string): string {
  const normalized = normalizeHistoryText(text);

  if (normalized.length <= historyExcerptLength) {
    return normalized;
  }

  return `${normalized.slice(0, historyExcerptLength).trim()}...`;
}

function normalizeHistoryText(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function getReadingSearchText(reading: CompletedReading): string {
  return [
    reading.localDate,
    reading.hexagramName,
    reading.theme,
    reading.basicInterpretation,
    reading.reflectionPrompt,
    reading.question,
    reading.premiumReading?.personalityName,
    reading.premiumReading?.text,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function useHistoryStyles() {
  const { colorMode } = useAppTheme();

  return createHistoryStyles(getAiChingColors(colorMode), colorMode);
}

function createHistoryStyles(colors: AiChingColorPalette, colorMode: 'dark' | 'light') {
  const isDark = colorMode === 'dark';
  const entryText = isDark ? '#f6f1e8' : colors.mist;
  const entryGold = isDark ? '#f1d17d' : colors.gold;
  const entryBorder = isDark ? 'rgba(241, 209, 125, 0.34)' : 'rgba(139, 93, 29, 0.24)';
  const entryPanel = isDark ? 'rgba(10, 12, 16, 0.72)' : '#f9efdF';
  const warningText = colorMode === 'dark' ? '#ffb4a8' : '#9b4237';
  const warningFill = colorMode === 'dark' ? '#ffb4a8' : '#b95549';

  return StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    flex: 1,
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  clearButton: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorMode === 'dark' ? 'rgba(255, 180, 168, 0.42)' : 'rgba(155, 66, 55, 0.42)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  clearButtonDisabled: {
    opacity: 0.42,
  },
  clearButtonText: {
    color: warningText,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  policyNote: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  searchBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.28)',
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  confirmBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorMode === 'dark' ? 'rgba(255, 180, 168, 0.36)' : 'rgba(155, 66, 55, 0.32)',
    backgroundColor: colorMode === 'dark' ? 'rgba(36, 18, 20, 0.68)' : '#fff3eb',
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  confirmTitle: {
    color: warningText,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  confirmBody: {
    color: colors.mist,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  cancelButton: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.32)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  confirmDeleteButton: {
    minHeight: 38,
    borderRadius: 8,
    backgroundColor: warningFill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  confirmDeleteButtonText: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  searchInput: {
    minHeight: 48,
    color: colors.mist,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  empty: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: colors.mist,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    gap: 16,
  },
  resultCount: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  card: {
    minHeight: isDark ? 320 : 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(139, 93, 29, 0.22)' : 'rgba(139, 93, 29, 0.2)',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
    opacity: isDark ? 1 : 0,
  },
  cardScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: isDark ? 'rgba(10, 12, 16, 0.56)' : 'transparent',
  },
  cardContent: {
    flex: 1,
    padding: isDark ? 16 : 18,
    gap: isDark ? 16 : 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightCardThumbnail: {
    display: isDark ? 'none' : 'flex',
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.inkSoft,
    marginBottom: 2,
  },
  hexagramSeal: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.32)',
    backgroundColor: '#101318',
    padding: 10,
  },
  cardText: {
    gap: 8,
    alignItems: 'center',
  },
  date: {
    color: entryGold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: entryText,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  cardBody: {
    color: entryText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  detailBlock: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: entryBorder,
    backgroundColor: entryPanel,
    padding: 12,
    gap: 6,
    marginTop: 4,
  },
  detailLabel: {
    color: entryGold,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  detailText: {
    color: entryText,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  expandButton: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: entryBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  expandButtonPressed: {
    opacity: 0.72,
  },
  expandButtonText: {
    color: entryGold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  loadMoreButton: {
    alignSelf: 'center',
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.38)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  loadMoreButtonText: {
    color: colors.gold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  deleteButton: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 168, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  deleteButtonText: {
    color: '#ffb4a8',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inlineConfirm: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 180, 168, 0.42)' : 'rgba(155, 66, 55, 0.32)',
    backgroundColor: isDark ? 'rgba(36, 18, 20, 0.72)' : '#fff3eb',
    padding: 10,
    gap: 8,
    marginTop: 4,
  },
  inlineConfirmBody: {
    color: isDark ? entryText : colors.mist,
  },
  premiumHeading: {
    color: entryGold,
  },
  premiumText: {
    color: entryText,
  },
  });
}
