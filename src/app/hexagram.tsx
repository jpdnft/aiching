import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

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
  const previousHexagramNumber = hexagram.number === 1 ? 64 : hexagram.number - 1;
  const nextHexagramNumber = hexagram.number === 64 ? 1 : hexagram.number + 1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handledImageSwipe = useRef(false);

  const navigateToHexagram = (number: number) => {
    router.replace(`/hexagram?id=${number}`);
  };

  const handleTouchEnd = (x: number, y: number) => {
    if (!touchStart.current) {
      return;
    }

    const deltaX = x - touchStart.current.x;
    const deltaY = y - touchStart.current.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;
    touchStart.current = null;

    if (!isHorizontalSwipe) {
      return;
    }

    navigateToHexagram(deltaX > 0 ? previousHexagramNumber : nextHexagramNumber);
  };

  const imageSwipeResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const horizontalMovement = Math.abs(gestureState.dx);
      const verticalMovement = Math.abs(gestureState.dy);

      return horizontalMovement > 12 && horizontalMovement > verticalMovement * 1.2;
    },
    onPanResponderRelease: (_, gestureState) => {
      const horizontalMovement = Math.abs(gestureState.dx);
      const verticalMovement = Math.abs(gestureState.dy);
      const isHorizontalSwipe = horizontalMovement > 44 && horizontalMovement > verticalMovement * 1.35;

      if (!isHorizontalSwipe) {
        return;
      }

      handledImageSwipe.current = true;
      navigateToHexagram(gestureState.dx > 0 ? previousHexagramNumber : nextHexagramNumber);
    },
  });

  return (
    <ScreenContainer>
      <View
        style={styles.swipeArea}
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          };
        }}
        onTouchEnd={(event) => {
          if (handledImageSwipe.current) {
            handledImageSwipe.current = false;
            touchStart.current = null;
            return;
          }

          const touch = event.nativeEvent.changedTouches[0];

          if (touch) {
            handleTouchEnd(touch.pageX, touch.pageY);
          }
        }}
      >
        <View style={styles.headerNav}>
          <Pressable
            accessibilityLabel={`View Hexagram ${previousHexagramNumber}`}
            onPress={() => navigateToHexagram(previousHexagramNumber)}
            style={styles.navArrow}
          >
            <Text style={styles.navArrowText}>{'<'}</Text>
          </Pressable>

          <View style={styles.header}>
            <HexagramView lines={hexagram.lineStates} size="small" />
            <Text style={styles.number}>Hexagram {hexagram.number}</Text>
            <Text style={styles.title}>{hexagram.name}</Text>
          </View>

          <Pressable
            accessibilityLabel={`View Hexagram ${nextHexagramNumber}`}
            onPress={() => navigateToHexagram(nextHexagramNumber)}
            style={styles.navArrow}
          >
            <Text style={styles.navArrowText}>{'>'}</Text>
          </Pressable>
        </View>

        <View style={styles.keywords}>
          {hexagram.keywords.map((keyword) => (
            <Text key={keyword} style={styles.keyword}>
              {keyword}
            </Text>
          ))}
        </View>

        {imageSource ? (
          <View style={styles.imageFrame} {...imageSwipeResponder.panHandlers}>
            <Image source={imageSource} style={styles.image} contentFit="cover" />
          </View>
        ) : null}

        <Pressable onPress={() => router.push('/browse-hexagrams')} style={styles.backLink}>
          <Text style={styles.backText}>Back to browse catalog</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  swipeArea: {
    width: '100%',
  },
  headerNav: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    maxWidth: 440,
  },
  navArrow: {
    width: 30,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  navArrowText: {
    color: aiChingColors.gold,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
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
  imageFrame: {
    width: '100%',
    maxWidth: 520,
    aspectRatio: 9 / 16,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.2)',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
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
