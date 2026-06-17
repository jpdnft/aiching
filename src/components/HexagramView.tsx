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

  return (
    <View
      style={[
        styles.frame,
        size === 'small' && styles.smallFrame,
        size === 'tiny' && styles.tinyFrame,
        size === 'mini' && styles.miniFrame,
      ]}>
      {displayLines.map((line, visualIndex) => {
        const storageIndex = 5 - visualIndex;
        const shouldAnimate = Boolean(line) && storageIndex === animatedLineIndex && size === 'large';

        return (
        <View
          key={`${visualIndex}-${line ?? 'empty'}`}
          style={[styles.lineSlot, size === 'mini' && styles.miniLineSlot]}>
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
  miniLineSlot: {
    height: 7,
  },
  animatedLine: {
    zIndex: 3,
  },
});
