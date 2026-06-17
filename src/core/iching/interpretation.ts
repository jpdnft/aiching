import { CompletedReading, Hexagram, HexagramLines } from './types';
import { getBinaryKey } from './generate';

export function createCompletedReading(params: {
  lines: HexagramLines;
  hexagram: Hexagram;
  localDate: string;
}): CompletedReading {
  const createdAt = new Date().toISOString();

  return {
    id: `${params.localDate}-${createdAt}`,
    localDate: params.localDate,
    createdAt,
    lines: params.lines,
    binaryKey: getBinaryKey(params.lines),
    hexagramNumber: params.hexagram.number,
    hexagramName: params.hexagram.name,
    theme: params.hexagram.theme,
    basicInterpretation: params.hexagram.basicInterpretation,
    reflectionPrompt: params.hexagram.reflectionPrompt,
  };
}
