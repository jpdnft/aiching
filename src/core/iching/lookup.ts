import { getBinaryKey } from './generate';
import { hexagrams } from './hexagrams';
import { Hexagram, HexagramLines } from './types';

const hexagramsByKey = new Map(hexagrams.map((hexagram) => [hexagram.binaryKey, hexagram]));

export function lookupHexagram(lines: HexagramLines): Hexagram {
  const key = getBinaryKey(lines);
  const hexagram = hexagramsByKey.get(key);

  if (!hexagram) {
    throw new Error(`No hexagram found for binary key ${key}`);
  }

  return hexagram;
}
