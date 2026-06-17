import { StyleSheet, View } from 'react-native';

import { toBasicLine } from '@/core/iching/generate';
import { LineState } from '@/core/iching/types';
import { aiChingColors } from '@/theme/colors';

type Props = {
  line?: LineState;
  muted?: boolean;
  size?: 'default' | 'mini';
};

export function HexagramLine({ line, muted = false, size = 'default' }: Props) {
  const isYin = line ? toBasicLine(line) === 'yin' : false;
  const color = muted ? 'rgba(231, 197, 111, 0.22)' : aiChingColors.gold;
  const isMini = size === 'mini';

  if (!line) {
    return <View style={[styles.placeholder, isMini && styles.miniPlaceholder, { borderColor: color }]} />;
  }

  if (isYin) {
    return (
      <View style={[styles.yinContainer, isMini && styles.miniLine]}>
        <View style={[styles.segment, isMini && styles.miniSegment, { backgroundColor: color }]} />
        <View style={[styles.segment, isMini && styles.miniSegment, { backgroundColor: color }]} />
      </View>
    );
  }

  return <View style={[styles.yang, isMini && styles.miniLine, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
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
