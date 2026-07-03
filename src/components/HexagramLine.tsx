import { StyleSheet, View } from 'react-native';

import { isChangingLine } from '@/core/iching/changingLines';
import { toBasicLine } from '@/core/iching/generate';
import { LineState } from '@/core/iching/types';
import { useAppTheme } from '@/theme/appTheme';
import { AppColorMode, getAiChingColors } from '@/theme/colors';

type Props = {
  line?: LineState;
  colorModeOverride?: AppColorMode;
  muted?: boolean;
  size?: 'default' | 'mini';
};

export function HexagramLine({ colorModeOverride, line, muted = false, size = 'default' }: Props) {
  const { colorMode } = useAppTheme();
  const effectiveColorMode = colorModeOverride ?? colorMode;
  const colors = getAiChingColors(effectiveColorMode);
  const isYin = line ? toBasicLine(line) === 'yin' : false;
  const isChanging = line ? isChangingLine(line) : false;
  const mutedColor = effectiveColorMode === 'dark' ? 'rgba(231, 197, 111, 0.22)' : 'rgba(139, 93, 29, 0.28)';
  const color = muted ? mutedColor : isChanging ? '#f8e7a1' : colors.gold;
  const isMini = size === 'mini';

  if (!line) {
    return <View style={[styles.placeholder, isMini && styles.miniPlaceholder, { borderColor: color }]} />;
  }

  if (isYin) {
    return (
      <View style={[styles.lineWrap, isChanging && !isMini && styles.changingGlow]}>
        <View style={[styles.yinContainer, isMini && styles.miniLine]}>
          <View style={[styles.segment, isMini && styles.miniSegment, { backgroundColor: color }]} />
          <View style={[styles.segment, isMini && styles.miniSegment, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.lineWrap, isChanging && !isMini && styles.changingGlow]}>
      <View style={[styles.yang, isMini && styles.miniLine, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  lineWrap: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  changingGlow: {
    shadowColor: '#f8e7a1',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  yang: {
    width: '100%',
    height: 12,
    borderRadius: 2,
  },
  yinContainer: {
    width: '100%',
    height: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segment: {
    width: '42%',
    height: 12,
    borderRadius: 2,
  },
  placeholder: {
    width: '100%',
    height: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    opacity: 0.5,
  },
  miniLine: {
    height: 5,
    borderRadius: 1,
  },
  miniSegment: {
    height: 5,
    borderRadius: 1,
  },
  miniPlaceholder: {
    height: 5,
  },
});
