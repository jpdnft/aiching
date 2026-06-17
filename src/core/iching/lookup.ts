import { getBinaryKey } from './generate';
import { getHexagramByNumber, hexagramSummaries } from './hexagrams';
import { Hexagram, HexagramLines } from './types';

const hexagramNumbersByKey = new Map(
  hexagramSummaries.map((hexagram) => [hexagram.binaryKey, hexagram.number]),
);

export function lookupHexagram(lines: HexagramLines): Hexagram {
  const key = getBinaryKey(lines);
  const hexagramNumber = hexagramNumbersByKey.get(key);

  if (!hexagramNumber) {
    throw new Error(`No hexagram found for binary key ${key}`);
  }

  return getHexagramByNumber(hexagramNumber);
}
