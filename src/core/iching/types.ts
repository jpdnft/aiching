export type BasicLine = 'yin' | 'yang';

export type LineState = 'young_yin' | 'young_yang' | 'old_yin' | 'old_yang';

/**
 * Hexagram lines are always stored bottom-up.
 * Index 0 is the bottom line; index 5 is the top line.
 */
export type HexagramLines = [
  LineState,
  LineState,
  LineState,
  LineState,
  LineState,
  LineState,
];

export type PartialHexagramLines = LineState[];

export type Hexagram = {
  number: number;
  name: string;
  chineseName?: string;
  binaryKey: string;
  lines: BasicLine[];
  keywords: string[];
  theme: string;
  basicInterpretation: string;
  reflectionPrompt: string;
  future?: {
    traditional?: string;
    career?: string;
    relationship?: string;
    creative?: string;
    shadow?: string;
  };
};

export type CompletedReading = {
  id: string;
  localDate: string;
  createdAt: string;
  question?: string;
  lines: HexagramLines;
  binaryKey: string;
  hexagramNumber: number;
  hexagramName: string;
  theme: string;
  basicInterpretation: string;
  reflectionPrompt: string;
};
