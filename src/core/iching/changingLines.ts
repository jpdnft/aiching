import { HexagramLines, LineState } from './types';

export function changesTo(line: LineState): LineState {
  if (line === 'old_yin') {
    return 'young_yang';
  }
  if (line === 'old_yang') {
    return 'young_yin';
  }
  return line;
}

export function isChangingLine(line: LineState): boolean {
  return line === 'old_yin' || line === 'old_yang';
}

export function getChangedHexagramLines(lines: HexagramLines): HexagramLines {
  return lines.map(changesTo) as HexagramLines;
}

export function hasChangingLines(lines: HexagramLines): boolean {
  return lines.some(isChangingLine);
}
