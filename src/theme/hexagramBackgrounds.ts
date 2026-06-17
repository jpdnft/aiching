export type HexagramThemeId = '01' | '02';

export const defaultHexagramThemeId: HexagramThemeId = '02';

type HexagramBackgrounds = Record<number, number>;

export type HexagramThemeManifest = {
  id: HexagramThemeId;
  name: string;
  description: string;
  imageFormat: 'webp' | 'png';
  isAvailable: boolean;
  homeBackground?: number;
  hexagramBackgrounds?: HexagramBackgrounds;
};

const theme01Backgrounds: HexagramBackgrounds = {
  1: require('@/assets/hexagrams/themes/01/01.webp'),
  2: require('@/assets/hexagrams/themes/01/02.webp'),
  3: require('@/assets/hexagrams/themes/01/03.webp'),
  4: require('@/assets/hexagrams/themes/01/04.webp'),
  5: require('@/assets/hexagrams/themes/01/05.webp'),
  6: require('@/assets/hexagrams/themes/01/06.webp'),
  7: require('@/assets/hexagrams/themes/01/07.webp'),
  8: require('@/assets/hexagrams/themes/01/08.webp'),
  9: require('@/assets/hexagrams/themes/01/09.webp'),
  10: require('@/assets/hexagrams/themes/01/10.webp'),
  11: require('@/assets/hexagrams/themes/01/11.webp'),
  12: require('@/assets/hexagrams/themes/01/12.webp'),
  13: require('@/assets/hexagrams/themes/01/13.webp'),
  14: require('@/assets/hexagrams/themes/01/14.webp'),
  15: require('@/assets/hexagrams/themes/01/15.webp'),
  16: require('@/assets/hexagrams/themes/01/16.webp'),
  17: require('@/assets/hexagrams/themes/01/17.webp'),
  18: require('@/assets/hexagrams/themes/01/18.webp'),
  19: require('@/assets/hexagrams/themes/01/19.webp'),
  20: require('@/assets/hexagrams/themes/01/20.webp'),
  21: require('@/assets/hexagrams/themes/01/21.webp'),
  22: require('@/assets/hexagrams/themes/01/22.webp'),
  23: require('@/assets/hexagrams/themes/01/23.webp'),
  24: require('@/assets/hexagrams/themes/01/24.webp'),
  25: require('@/assets/hexagrams/themes/01/25.webp'),
  26: require('@/assets/hexagrams/themes/01/26.webp'),
  27: require('@/assets/hexagrams/themes/01/27.webp'),
  28: require('@/assets/hexagrams/themes/01/28.webp'),
  29: require('@/assets/hexagrams/themes/01/29.webp'),
  30: require('@/assets/hexagrams/themes/01/30.webp'),
  31: require('@/assets/hexagrams/themes/01/31.webp'),
  32: require('@/assets/hexagrams/themes/01/32.webp'),
  33: require('@/assets/hexagrams/themes/01/33.webp'),
  34: require('@/assets/hexagrams/themes/01/34.webp'),
  35: require('@/assets/hexagrams/themes/01/35.webp'),
  36: require('@/assets/hexagrams/themes/01/36.webp'),
  37: require('@/assets/hexagrams/themes/01/37.webp'),
  38: require('@/assets/hexagrams/themes/01/38.webp'),
  39: require('@/assets/hexagrams/themes/01/39.webp'),
  40: require('@/assets/hexagrams/themes/01/40.webp'),
  41: require('@/assets/hexagrams/themes/01/41.webp'),
  42: require('@/assets/hexagrams/themes/01/42.webp'),
  43: require('@/assets/hexagrams/themes/01/43.webp'),
  44: require('@/assets/hexagrams/themes/01/44.webp'),
  45: require('@/assets/hexagrams/themes/01/45.webp'),
  46: require('@/assets/hexagrams/themes/01/46.webp'),
  47: require('@/assets/hexagrams/themes/01/47.webp'),
  48: require('@/assets/hexagrams/themes/01/48.webp'),
  49: require('@/assets/hexagrams/themes/01/49.webp'),
  50: require('@/assets/hexagrams/themes/01/50.webp'),
  51: require('@/assets/hexagrams/themes/01/51.webp'),
  52: require('@/assets/hexagrams/themes/01/52.webp'),
  53: require('@/assets/hexagrams/themes/01/53.webp'),
  54: require('@/assets/hexagrams/themes/01/54.webp'),
  55: require('@/assets/hexagrams/themes/01/55.webp'),
  56: require('@/assets/hexagrams/themes/01/56.webp'),
  57: require('@/assets/hexagrams/themes/01/57.webp'),
  58: require('@/assets/hexagrams/themes/01/58.webp'),
  59: require('@/assets/hexagrams/themes/01/59.webp'),
  60: require('@/assets/hexagrams/themes/01/60.webp'),
  61: require('@/assets/hexagrams/themes/01/61.webp'),
  62: require('@/assets/hexagrams/themes/01/62.webp'),
  63: require('@/assets/hexagrams/themes/01/63.webp'),
  64: require('@/assets/hexagrams/themes/01/64.webp'),
};

const theme02Backgrounds: HexagramBackgrounds = {
  1: require('@/assets/hexagrams/themes/02/01.png'),
  2: require('@/assets/hexagrams/themes/02/02.png'),
  3: require('@/assets/hexagrams/themes/02/03.png'),
  4: require('@/assets/hexagrams/themes/02/04.png'),
  5: require('@/assets/hexagrams/themes/02/05.png'),
  6: require('@/assets/hexagrams/themes/02/06.png'),
  7: require('@/assets/hexagrams/themes/02/07.png'),
  8: require('@/assets/hexagrams/themes/02/08.png'),
  9: require('@/assets/hexagrams/themes/02/09.png'),
  10: require('@/assets/hexagrams/themes/02/10.png'),
  11: require('@/assets/hexagrams/themes/02/11.png'),
  12: require('@/assets/hexagrams/themes/02/12.png'),
  13: require('@/assets/hexagrams/themes/02/13.png'),
  14: require('@/assets/hexagrams/themes/02/14.png'),
  15: require('@/assets/hexagrams/themes/02/15.png'),
  16: require('@/assets/hexagrams/themes/02/16.png'),
  17: require('@/assets/hexagrams/themes/02/17.png'),
  18: require('@/assets/hexagrams/themes/02/18.png'),
  19: require('@/assets/hexagrams/themes/02/19.png'),
  20: require('@/assets/hexagrams/themes/02/20.png'),
  21: require('@/assets/hexagrams/themes/02/21.png'),
  22: require('@/assets/hexagrams/themes/02/22.png'),
  23: require('@/assets/hexagrams/themes/02/23.png'),
  24: require('@/assets/hexagrams/themes/02/24.png'),
  25: require('@/assets/hexagrams/themes/02/25.png'),
  26: require('@/assets/hexagrams/themes/02/26.png'),
  27: require('@/assets/hexagrams/themes/02/27.png'),
  28: require('@/assets/hexagrams/themes/02/28.png'),
  29: require('@/assets/hexagrams/themes/02/29.png'),
  30: require('@/assets/hexagrams/themes/02/30.png'),
  31: require('@/assets/hexagrams/themes/02/31.png'),
  32: require('@/assets/hexagrams/themes/02/32.png'),
  33: require('@/assets/hexagrams/themes/02/33.png'),
  34: require('@/assets/hexagrams/themes/02/34.png'),
  35: require('@/assets/hexagrams/themes/02/35.png'),
  36: require('@/assets/hexagrams/themes/02/36.png'),
  37: require('@/assets/hexagrams/themes/02/37.png'),
  38: require('@/assets/hexagrams/themes/02/38.png'),
  39: require('@/assets/hexagrams/themes/02/39.png'),
  40: require('@/assets/hexagrams/themes/02/40.png'),
  41: require('@/assets/hexagrams/themes/02/41.png'),
  42: require('@/assets/hexagrams/themes/02/42.png'),
  43: require('@/assets/hexagrams/themes/02/43.png'),
  44: require('@/assets/hexagrams/themes/02/44.png'),
  45: require('@/assets/hexagrams/themes/02/45.png'),
  46: require('@/assets/hexagrams/themes/02/46.png'),
  47: require('@/assets/hexagrams/themes/02/47.png'),
  48: require('@/assets/hexagrams/themes/02/48.png'),
  49: require('@/assets/hexagrams/themes/02/49.png'),
  50: require('@/assets/hexagrams/themes/02/50.png'),
  51: require('@/assets/hexagrams/themes/02/51.png'),
  52: require('@/assets/hexagrams/themes/02/52.png'),
  53: require('@/assets/hexagrams/themes/02/53.png'),
  54: require('@/assets/hexagrams/themes/02/54.png'),
  55: require('@/assets/hexagrams/themes/02/55.png'),
  56: require('@/assets/hexagrams/themes/02/56.png'),
  57: require('@/assets/hexagrams/themes/02/57.png'),
  58: require('@/assets/hexagrams/themes/02/58.png'),
  59: require('@/assets/hexagrams/themes/02/59.png'),
  60: require('@/assets/hexagrams/themes/02/60.png'),
  61: require('@/assets/hexagrams/themes/02/61.png'),
  62: require('@/assets/hexagrams/themes/02/62.png'),
  63: require('@/assets/hexagrams/themes/02/63.png'),
  64: require('@/assets/hexagrams/themes/02/64.png'),
};

export const hexagramThemes: Record<HexagramThemeId, HexagramThemeManifest> = {
  '01': {
    id: '01',
    name: 'Ink Mist',
    description: 'Dark ink-wash landscapes, elemental atmosphere, mist, and restrained gold light.',
    imageFormat: 'webp',
    isAvailable: true,
    homeBackground: require('@/assets/hexagrams/themes/01/home.webp'),
    hexagramBackgrounds: theme01Backgrounds,
  },
  '02': {
    id: '02',
    name: 'Soft Wonder',
    description: 'Painterly anime softness, lived-in warmth, emotional weather, and quiet everyday magic.',
    imageFormat: 'png',
    isAvailable: true,
    homeBackground: require('@/assets/hexagrams/themes/02/home.png'),
    hexagramBackgrounds: theme02Backgrounds,
  },
};

export const hexagramThemeList = Object.values(hexagramThemes);

export function isHexagramThemeAvailable(themeId: HexagramThemeId): boolean {
  return hexagramThemes[themeId].isAvailable;
}

export function getThemeName(themeId: HexagramThemeId): string {
  return hexagramThemes[themeId].name;
}

export function getHexagramBackgroundSource(
  hexagramNumber: number,
  themeId: HexagramThemeId = defaultHexagramThemeId,
): number | undefined {
  return hexagramThemes[themeId].hexagramBackgrounds?.[hexagramNumber];
}

export function getHomeBackgroundSource(
  themeId: HexagramThemeId = defaultHexagramThemeId,
): number | undefined {
  return hexagramThemes[themeId].homeBackground;
}
