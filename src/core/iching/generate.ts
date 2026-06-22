import {
  BasicLine,
  CastLineDetail,
  CastLineTotal,
  CastValue,
  HexagramLines,
  LineState,
  PartialHexagramLines,
} from './types';

export function generateBasicLine(): LineState {
  return Math.random() < 0.5 ? 'young_yin' : 'young_yang';
}

export function generatePremiumCastLine(position: number): CastLineDetail {
  const values: [CastValue, CastValue, CastValue] = [
    generateCastValue(),
    generateCastValue(),
    generateCastValue(),
  ];
  const total = (values[0] + values[1] + values[2]) as CastLineTotal;

  return {
    line: getLineStateFromTotal(total),
    position,
    total,
    values,
  };
}

export function generateCastValue(): CastValue {
  return Math.random() < 0.5 ? 2 : 3;
}

export function getLineStateFromTotal(total: CastLineTotal): LineState {
  if (total === 6) {
    return 'old_yin';
  }

  if (total === 7) {
    return 'young_yang';
  }

  if (total === 8) {
    return 'young_yin';
  }

  return 'old_yang';
}

export function getCastLineDescription(detail: CastLineDetail): string {
  const lineType = getLineStateLabel(detail.line);
  const stability = detail.line === 'old_yin' || detail.line === 'old_yang' ? 'changing' : 'stable';
  const shape = toBasicLine(detail.line) === 'yang' ? 'solid line' : 'broken line';

  return `${detail.values.join('+')} = ${detail.total}, ${lineType}, ${stability} ${shape}`;
}

export function getLineStateLabel(line: LineState): string {
  if (line === 'old_yin') {
    return 'old yin';
  }

  if (line === 'old_yang') {
    return 'old yang';
  }

  if (line === 'young_yin') {
    return 'young yin';
  }

  return 'young yang';
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
