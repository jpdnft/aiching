import { StyleSheet, View } from 'react-native';

import { HexagramLine } from './HexagramLine';

import { LineState, PartialHexagramLines } from '@/core/iching/types';

type Props = {
  lines: PartialHexagramLines;
  size?: 'large' | 'small' | 'tiny' | 'mini';
};

export function HexagramView({ lines, size = 'large' }: Props) {
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
      {displayLines.map((line, index) => (
        <View
          key={`${index}-${line ?? 'empty'}`}
          style={[styles.lineSlot, size === 'mini' && styles.miniLineSlot]}>
          <HexagramLine line={line} muted={!line} size={size === 'mini' ? 'mini' : 'default'} />
        </View>
      ))}
    </View>
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
});
