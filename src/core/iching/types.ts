export type BasicLine = 'yin' | 'yang';

export type LineState = 'young_yin' | 'young_yang' | 'old_yin' | 'old_yang';

export type CastValue = 2 | 3;

export type CastLineTotal = 6 | 7 | 8 | 9;

export type CastLineDetail = {
  line: LineState;
  position: number;
  total: CastLineTotal;
  values: [CastValue, CastValue, CastValue];
};

export type HexagramTone =
  | 'abundant'
  | 'adaptive'
  | 'approaching'
  | 'awakening'
  | 'balancing'
  | 'beautifying'
  | 'bonding'
  | 'careful'
  | 'cautious'
  | 'challenging'
  | 'clarifying'
  | 'clear'
  | 'communal'
  | 'concealed'
  | 'constrained'
  | 'contemplative'
  | 'contested'
  | 'corrective'
  | 'creative'
  | 'cultivating'
  | 'dangerous'
  | 'decisive'
  | 'declining'
  | 'differentiating'
  | 'disciplined'
  | 'disruptive'
  | 'expansive'
  | 'forming'
  | 'gathering'
  | 'generous'
  | 'gradual'
  | 'grounding'
  | 'harmonizing'
  | 'initiatory'
  | 'instructive'
  | 'intimate'
  | 'joyful'
  | 'open'
  | 'organized'
  | 'overloaded'
  | 'penetrating'
  | 'persevering'
  | 'powerful'
  | 'protective'
  | 'radiant'
  | 'receptive'
  | 'relational'
  | 'releasing'
  | 'renewing'
  | 'responsive'
  | 'restrained'
  | 'restorative'
  | 'rising'
  | 'sincere'
  | 'stabilizing'
  | 'stagnant'
  | 'subtle'
  | 'supportive'
  | 'sustaining'
  | 'transformative'
  | 'transitional'
  | 'uncertain'
  | 'unsettled'
  | 'volatile';

export type HexagramMomentum =
  | 'abundant'
  | 'adaptive'
  | 'adorning'
  | 'awakening'
  | 'blocked'
  | 'breaking-through'
  | 'cautious'
  | 'centering'
  | 'completed'
  | 'concealed'
  | 'constrained'
  | 'contested'
  | 'continuing'
  | 'correcting'
  | 'dangerous'
  | 'declining'
  | 'delicate'
  | 'disintegrating'
  | 'dispersing'
  | 'disruptive'
  | 'divided'
  | 'exhausted'
  | 'expanding'
  | 'flourishing'
  | 'forming'
  | 'gathering'
  | 'gradual'
  | 'growing'
  | 'illuminating'
  | 'initiating'
  | 'learning'
  | 'limiting'
  | 'moving'
  | 'negotiating'
  | 'observing'
  | 'opening'
  | 'organizing'
  | 'overloaded'
  | 'peaking'
  | 'penetrating'
  | 'receiving'
  | 'releasing'
  | 'renewing'
  | 'repeating'
  | 'restrained'
  | 'restoring'
  | 'returning'
  | 'rising'
  | 'settling'
  | 'shared'
  | 'simplifying'
  | 'stabilizing'
  | 'still'
  | 'subordinated'
  | 'sudden'
  | 'sustaining'
  | 'transforming'
  | 'turning'
  | 'unfinished'
  | 'unforced'
  | 'unsettled'
  | 'waiting'
  | 'withdrawing';

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
  primaryTone: HexagramTone[];
  supportScore: number;
  cautionScore: number;
  momentum: HexagramMomentum[];
  momentumNotes: string[];
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
  applicationPrompt: string;
};

export type CompletedReading = {
  id: string;
  localDate: string;
  createdAt: string;
  lineCastDetails?: CastLineDetail[];
  question?: string;
  premiumReading?: PremiumReading;
  lines: HexagramLines;
  binaryKey: string;
  hexagramNumber: number;
  hexagramName: string;
  resultingBinaryKey?: string;
  resultingHexagramName?: string;
  resultingHexagramNumber?: number;
  theme: string;
  basicInterpretation: string;
  reflectionPrompt: string;
};

export type PremiumReading = {
  generatedAt: string;
  model: string;
  personalityId: string;
  personalityName: string;
  text: string;
};
