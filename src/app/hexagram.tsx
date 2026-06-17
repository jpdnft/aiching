import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HexagramView } from '@/components/HexagramView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getHexagramByNumber } from '@/core/iching/hexagrams';
import { useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';
import { getHexagramBackgroundSource } from '@/theme/hexagramBackgrounds';

function getHexagramId(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 64) {
    return 1;
  }

  return parsed;
}

export default function HexagramDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { themeId } = useAppTheme();
  const hexagram = getHexagramByNumber(getHexagramId(params.id));
  const imageSource = getHexagramBackgroundSource(hexagram.number, themeId);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <HexagramView lines={hexagram.lineStates} size="small" />
        <Text style={styles.number}>Hexagram {hexagram.number}</Text>
        <Text style={styles.title}>{hexagram.name}</Text>
      </View>

      <View style={styles.keywords}>
        {hexagram.keywords.map((keyword) => (
          <Text key={keyword} style={styles.keyword}>
            {keyword}
          </Text>
        ))}
      </View>

      {imageSource ? (
        <Image source={imageSource} style={styles.image} contentFit="cover" />
      ) : null}

      <Pressable onPress={() => router.push('/browse-hexagrams')} style={styles.backLink}>
        <Text style={styles.backText}>Back to browse catalog</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  number: {
    color: aiChingColors.gold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 22,
  },
  keyword: {
    color: aiChingColors.mist,
    fontSize: 13,
    lineHeight: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.18)',
    backgroundColor: aiChingColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  image: {
    width: '100%',
    maxWidth: 520,
    aspectRatio: 9 / 16,
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.2)',
    marginBottom: 24,
  },
  backLink: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    color: aiChingColors.gold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
});
