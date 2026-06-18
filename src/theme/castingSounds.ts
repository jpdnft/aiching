export type CastingSoundId =
  | 'cast-line01'
  | 'cast-line02'
  | 'cast-line03'
  | 'cast-line04'
  | 'cast-line05'
  | 'cast-line06'
  | 'cast-line07'
  | 'cast-line08'
  | 'cast-line09'
  | 'cast-line10'
  | 'cast-line11'
  | 'cast-line12'
  | 'cast-line13'
  | 'cast-line14'
  | 'cast-line15'
  | 'cast-line16'
  | 'cast-line17'
  | 'cast-line18'
  | 'cast-line19'
  | 'cast-line20'
  | 'cast-line21';

export type CastingSound = {
  id: CastingSoundId;
  name: string;
  filename: string;
  source: number;
};

export const defaultCastingSoundId: CastingSoundId = 'cast-line01';

export const castingSounds: Record<CastingSoundId, CastingSound> = {
  'cast-line01': {
    id: 'cast-line01',
    name: 'Default Chime',
    filename: 'cast-line01.mp3',
    source: require('@/assets/sounds/cast-line01.mp3'),
  },
  'cast-line02': {
    id: 'cast-line02',
    name: 'Whoosh',
    filename: 'cast-line02.mp3',
    source: require('@/assets/sounds/cast-line02.mp3'),
  },
  'cast-line03': {
    id: 'cast-line03',
    name: 'Bigger Whoosh',
    filename: 'cast-line03.mp3',
    source: require('@/assets/sounds/cast-line03.mp3'),
  },
  'cast-line04': {
    id: 'cast-line04',
    name: 'Quicker Whoosh',
    filename: 'cast-line04.mp3',
    source: require('@/assets/sounds/cast-line04.mp3'),
  },
  'cast-line05': {
    id: 'cast-line05',
    name: 'Crunchy Leaves',
    filename: 'cast-line05.mp3',
    source: require('@/assets/sounds/cast-line05.mp3'),
  },
  'cast-line06': {
    id: 'cast-line06',
    name: 'Eagle',
    filename: 'cast-line06.mp3',
    source: require('@/assets/sounds/cast-line06.mp3'),
  },
  'cast-line07': {
    id: 'cast-line07',
    name: 'Electro-Whirr',
    filename: 'cast-line07.mp3',
    source: require('@/assets/sounds/cast-line07.mp3'),
  },
  'cast-line08': {
    id: 'cast-line08',
    name: 'Gizmo',
    filename: 'cast-line08.mp3',
    source: require('@/assets/sounds/cast-line08.mp3'),
  },
  'cast-line09': {
    id: 'cast-line09',
    name: 'Water Zap',
    filename: 'cast-line09.mp3',
    source: require('@/assets/sounds/cast-line09.mp3'),
  },
  'cast-line10': {
    id: 'cast-line10',
    name: 'Brief Ping',
    filename: 'cast-line10.mp3',
    source: require('@/assets/sounds/cast-line10.mp3'),
  },
  'cast-line11': {
    id: 'cast-line11',
    name: 'Pop',
    filename: 'cast-line11.mp3',
    source: require('@/assets/sounds/cast-line11.mp3'),
  },
  'cast-line12': {
    id: 'cast-line12',
    name: 'Chimes',
    filename: 'cast-line12.mp3',
    source: require('@/assets/sounds/cast-line12.mp3'),
  },
  'cast-line13': {
    id: 'cast-line13',
    name: 'Beep-Boop',
    filename: 'cast-line13.mp3',
    source: require('@/assets/sounds/cast-line13.mp3'),
  },
  'cast-line14': {
    id: 'cast-line14',
    name: 'Robot Whistle',
    filename: 'cast-line14.mp3',
    source: require('@/assets/sounds/cast-line14.mp3'),
  },
  'cast-line15': {
    id: 'cast-line15',
    name: 'Ding-Dong',
    filename: 'cast-line15.mp3',
    source: require('@/assets/sounds/cast-line15.mp3'),
  },
  'cast-line16': {
    id: 'cast-line16',
    name: 'Descending Arpeggio',
    filename: 'cast-line16.mp3',
    source: require('@/assets/sounds/cast-line16.mp3'),
  },
  'cast-line17': {
    id: 'cast-line17',
    name: 'Success Chime',
    filename: 'cast-line17.mp3',
    source: require('@/assets/sounds/cast-line17.mp3'),
  },
  'cast-line18': {
    id: 'cast-line18',
    name: 'Acounstic Guitar',
    filename: 'cast-line18.mp3',
    source: require('@/assets/sounds/cast-line18.mp3'),
  },
  'cast-line19': {
    id: 'cast-line19',
    name: '90s Computer',
    filename: 'cast-line19.mp3',
    source: require('@/assets/sounds/cast-line19.mp3'),
  },
  'cast-line20': {
    id: 'cast-line20',
    name: 'Dizzy Meow',
    filename: 'cast-line20.mp3',
    source: require('@/assets/sounds/cast-line20.mp3'),
  },
  'cast-line21': {
    id: 'cast-line21',
    name: 'Cat Meow',
    filename: 'cast-line21.mp3',
    source: require('@/assets/sounds/cast-line21.mp3'),
  },
};

export const castingSoundList = Object.values(castingSounds);

export function isCastingSoundId(value: string | null): value is CastingSoundId {
  return Object.prototype.hasOwnProperty.call(castingSounds, value ?? '');
}

export function getCastingSoundSource(soundId: CastingSoundId): number {
  return castingSounds[soundId].source;
}
