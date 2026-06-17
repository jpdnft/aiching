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
  lineStates: HexagramLines;
  lowerTrigram?: string;
  upperTrigram?: string;
  keywords: string[];
  theme: string;
  basicInterpretation: string;
  reflectionPrompt: string;
  relationships: {
    reversed: HexagramRelationship;
    opposite: HexagramRelationship;
  };
  future?: {
    traditional?: string;
    career?: string;
    relationship?: string;
    creative?: string;
    shadow?: string;
  };
};

export type HexagramRelationship = {
  number: number;
  sameAsPrimary?: boolean;
  theme: string;
  reflection: string;
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
