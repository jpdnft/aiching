import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { HexagramLine } from './HexagramLine';

import { LineState, PartialHexagramLines } from '@/core/iching/types';

type Props = {
  lines: PartialHexagramLines;
  size?: 'large' | 'small' | 'tiny' | 'mini';
  animatedLineIndex?: number | null;
  animationKey?: number;
  onLineAnimationComplete?: () => void;
};

export function HexagramView({
  lines,
  size = 'large',
  animatedLineIndex = null,
  animationKey = 0,
  onLineAnimationComplete,
}: Props) {
  const displayLines: (LineState | undefined)[] = Array.from(
    { length: 6 },
    (_, visualIndex) => lines[5 - visualIndex],
  );
  const isLarge = size === 'large';

  return (
    <View
      style={[
        styles.frame,
        isLarge && styles.oracleFrame,
        size === 'small' && styles.smallFrame,
        size === 'tiny' && styles.tinyFrame,
        size === 'mini' && styles.miniFrame,
      ]}>
      {isLarge ? (
        <>
          <View pointerEvents="none" style={styles.moonPool} />
          <View pointerEvents="none" style={[styles.cornerMark, styles.cornerTopLeft]} />
          <View pointerEvents="none" style={[styles.cornerMark, styles.cornerTopRight]} />
          <View pointerEvents="none" style={[styles.cornerMark, styles.cornerBottomLeft]} />
          <View pointerEvents="none" style={[styles.cornerMark, styles.cornerBottomRight]} />
        </>
      ) : null}
      {displayLines.map((line, visualIndex) => {
        const storageIndex = 5 - visualIndex;
        const shouldAnimate = Boolean(line) && storageIndex === animatedLineIndex && size === 'large';

        return (
          <View
            key={`${visualIndex}-${line ?? 'empty'}`}
            style={[styles.lineSlot, isLarge && styles.largeLineSlot, size === 'mini' && styles.miniLineSlot]}>
            <AnimatedHexagramLine
              animationKey={animationKey}
              line={line}
              muted={!line}
              onAnimationComplete={onLineAnimationComplete}
              shouldAnimate={shouldAnimate}
              size={size === 'mini' ? 'mini' : 'default'}
            />
          </View>
        );
      })}
    </View>
  );
}

function AnimatedHexagramLine({
  animationKey,
  line,
  muted,
  onAnimationComplete,
  shouldAnimate,
  size,
}: {
  animationKey: number;
  line?: LineState;
  muted: boolean;
  onAnimationComplete?: () => void;
  shouldAnimate: boolean;
  size: 'default' | 'mini';
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!shouldAnimate) {
      opacity.value = 1;
      scale.value = 1;
      translateY.value = 0;
      return;
    }

    opacity.value = 0;
    scale.value = 0.96;
    translateY.value = -260;

    opacity.value = withTiming(1, { duration: 120 });
    scale.value = withSequence(
      withTiming(1.02, { duration: 260, easing: Easing.out(Easing.cubic) }),
      withSpring(1, { damping: 18, stiffness: 220 }),
    );
    translateY.value = withSequence(
      withTiming(-8, { duration: 320, easing: Easing.out(Easing.cubic) }),
      withSpring(0, { damping: 18, stiffness: 240 }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }),
    );
  }, [animationKey, onAnimationComplete, opacity, scale, shouldAnimate, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[shouldAnimate && styles.animatedLine, animatedStyle]}>
      <HexagramLine line={line} muted={muted} size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 220,
    minHeight: 260,
    paddingVertical: 30,
    paddingHorizontal: 26,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.32)',
    justifyContent: 'space-between',
  },
  oracleFrame: {
    borderRadius: 8,
    borderColor: 'rgba(231, 197, 111, 0.52)',
    backgroundColor: 'rgba(8, 10, 13, 0.58)',
    shadowColor: '#e7c56f',
    shadowOpacity: 0.26,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    overflow: 'hidden',
  },
  moonPool: {
    position: 'absolute',
    top: 38,
    left: 22,
    right: 22,
    bottom: 38,
    borderRadius: 999,
    backgroundColor: 'rgba(231, 197, 111, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.12)',
    transform: [{ scaleX: 0.82 }],
  },
  cornerMark: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: 'rgba(231, 197, 111, 0.68)',
  },
  cornerTopLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTopRight: {
    top: 10,
    right: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  cornerBottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBottomRight: {
    right: 10,
    bottom: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  smallFrame: {
    width: 150,
    minHeight: 178,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  tinyFrame: {
    width: 88,
    minHeight: 118,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  miniFrame: {
    width: 48,
    minHeight: 68,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  lineSlot: {
    height: 16,
    justifyContent: 'center',
  },
  largeLineSlot: {
    zIndex: 2,
  },
  miniLineSlot: {
    height: 7,
  },
  animatedLine: {
    zIndex: 3,
  },
});
