import { StyleSheet, View } from 'react-native';

import { toBasicLine } from '@/core/iching/generate';
import { LineState } from '@/core/iching/types';
import { aiChingColors } from '@/theme/colors';

type Props = {
  line?: LineState;
  muted?: boolean;
};

export function HexagramLine({ line, muted = false }: Props) {
  const isYin = line ? toBasicLine(line) === 'yin' : false;
  const color = muted ? 'rgba(231, 197, 111, 0.22)' : aiChingColors.gold;

  if (!line) {
    return <View style={[styles.placeholder, { borderColor: color }]} />;
  }

  if (isYin) {
    return (
      <View style={styles.yinContainer}>
        <View style={[styles.segment, { backgroundColor: color }]} />
        <View style={[styles.segment, { backgroundColor: color }]} />
      </View>
    );
  }

  return <View style={[styles.yang, { backgroundColor: color }]} />;
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
});
