import { StyleSheet, View } from 'react-native';

import { HexagramLine } from './HexagramLine';

import { LineState, PartialHexagramLines } from '@/core/iching/types';

type Props = {
  lines: PartialHexagramLines;
  size?: 'large' | 'small';
};

export function HexagramView({ lines, size = 'large' }: Props) {
  const displayLines: (LineState | undefined)[] = Array.from(
    { length: 6 },
    (_, visualIndex) => lines[5 - visualIndex],
  );

  return (
    <View style={[styles.frame, size === 'small' && styles.smallFrame]}>
      {displayLines.map((line, index) => (
        <View key={`${index}-${line ?? 'empty'}`} style={styles.lineSlot}>
          <HexagramLine line={line} muted={!line} />
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
  lineSlot: {
    height: 16,
    justifyContent: 'center',
  },
});
