import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getHexagramByNumber, hexagramSummaries } from '@/core/iching/hexagrams';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const hexagrams = hexagramSummaries.map((summary) => getHexagramByNumber(summary.number));

export default function BrowseHexagramsScreen() {
  const router = useRouter();
  const styles = useBrowseHexagramsStyles();

  return (
    <ScreenContainer themeAware>
      <Text style={styles.title}>Browse Hexagrams</Text>
      <Text style={styles.intro}>Explore the 64 patterns in the AI Ching library.</Text>

      <View style={styles.grid}>
        {hexagrams.map((hexagram) => (
          <Pressable
            key={hexagram.number}
            onPress={() =>
              router.push({
                pathname: '/hexagram',
                params: { id: String(hexagram.number) },
              })
            }
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.hexagramSeal}>
              <HexagramView colorModeOverride="dark" lines={hexagram.lineStates} size="mini" />
            </View>
            <Text style={styles.cardNumber}>{String(hexagram.number).padStart(2, '0')}</Text>
            <Text style={styles.cardName} numberOfLines={2}>
              {hexagram.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

function useBrowseHexagramsStyles() {
  const { colorMode } = useAppTheme();

  return createBrowseHexagramsStyles(getAiChingColors(colorMode));
}

function createBrowseHexagramsStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  title: {
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: '23%',
    minHeight: 154,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardNumber: {
    color: colors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  cardName: {
    color: colors.mist,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  hexagramSeal: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.24)',
    backgroundColor: '#101318',
    padding: 6,
  },
  });
}
