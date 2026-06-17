import { BasicLine, HexagramLines, LineState, PartialHexagramLines } from './types';

export function generateBasicLine(): LineState {
  return Math.random() < 0.5 ? 'young_yin' : 'young_yang';
}

export function toBasicLine(line: LineState): BasicLine {
  return line === 'young_yang' || line === 'old_yang' ? 'yang' : 'yin';
}

export function isCompleteHexagram(lines: PartialHexagramLines): lines is HexagramLines {
  return lines.length === 6;
}

export function getBinaryKey(lines: HexagramLines): string {
  return lines.map((line) => (toBasicLine(line) === 'yang' ? '1' : '0')).join('');
}

export function addCastLine(lines: PartialHexagramLines): PartialHexagramLines {
  if (lines.length >= 6) {
    return lines;
  }

  return [...lines, generateBasicLine()];
}
