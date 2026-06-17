import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getHexagramByNumber, hexagramSummaries } from '@/core/iching/hexagrams';
import { aiChingColors } from '@/theme/colors';

const hexagrams = hexagramSummaries.map((summary) => getHexagramByNumber(summary.number));

export default function BrowseHexagramsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
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
            <HexagramView lines={hexagram.lineStates} size="mini" />
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

const styles = StyleSheet.create({
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: aiChingColors.muted,
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
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardNumber: {
    color: aiChingColors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  cardName: {
    color: aiChingColors.mist,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
