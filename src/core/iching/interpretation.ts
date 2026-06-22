import { getChangedHexagramLines, hasChangingLines } from './changingLines';
import { lookupHexagram } from './lookup';
import { CastLineDetail, CompletedReading, Hexagram, HexagramLines } from './types';
import { getBinaryKey } from './generate';

export function createCompletedReading(params: {
  lineCastDetails?: CastLineDetail[];
  lines: HexagramLines;
  hexagram: Hexagram;
  localDate: string;
  question?: string;
}): CompletedReading {
  const createdAt = new Date().toISOString();
  const changedLines = hasChangingLines(params.lines) ? getChangedHexagramLines(params.lines) : null;
  const resultingHexagram = changedLines ? lookupHexagram(changedLines) : null;

  return {
    id: `${params.localDate}-${createdAt}`,
    localDate: params.localDate,
    createdAt,
    lineCastDetails: params.lineCastDetails,
    question: params.question,
    lines: params.lines,
    binaryKey: getBinaryKey(params.lines),
    hexagramNumber: params.hexagram.number,
    hexagramName: params.hexagram.name,
    resultingBinaryKey: changedLines ? getBinaryKey(changedLines) : undefined,
    resultingHexagramName: resultingHexagram?.name,
    resultingHexagramNumber: resultingHexagram?.number,
    theme: params.hexagram.theme,
    basicInterpretation: params.hexagram.basicInterpretation,
    reflectionPrompt: params.hexagram.reflectionPrompt,
  };
}
