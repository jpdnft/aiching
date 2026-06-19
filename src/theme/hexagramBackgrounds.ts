export type HexagramThemeId = '01' | '02' | '03';

export const defaultHexagramThemeId: HexagramThemeId = '02';

type HexagramBackgrounds = Record<number, number>;
type AiReadingAvatarSources = Record<string, number>;

export type HexagramThemeManifest = {
  id: HexagramThemeId;
  name: string;
  description: string;
  isAvailable: boolean;
  aiReadingAvatars?: AiReadingAvatarSources;
  homeBackground?: number;
  hexagramBackgrounds?: HexagramBackgrounds;
};

const theme01Backgrounds: HexagramBackgrounds = {
  1: require('@/assets/hexagrams/themes/01/01.jpg'),
  2: require('@/assets/hexagrams/themes/01/02.jpg'),
  3: require('@/assets/hexagrams/themes/01/03.jpg'),
  4: require('@/assets/hexagrams/themes/01/04.jpg'),
  5: require('@/assets/hexagrams/themes/01/05.jpg'),
  6: require('@/assets/hexagrams/themes/01/06.jpg'),
  7: require('@/assets/hexagrams/themes/01/07.jpg'),
  8: require('@/assets/hexagrams/themes/01/08.jpg'),
  9: require('@/assets/hexagrams/themes/01/09.jpg'),
  10: require('@/assets/hexagrams/themes/01/10.jpg'),
  11: require('@/assets/hexagrams/themes/01/11.jpg'),
  12: require('@/assets/hexagrams/themes/01/12.jpg'),
  13: require('@/assets/hexagrams/themes/01/13.jpg'),
  14: require('@/assets/hexagrams/themes/01/14.jpg'),
  15: require('@/assets/hexagrams/themes/01/15.jpg'),
  16: require('@/assets/hexagrams/themes/01/16.jpg'),
  17: require('@/assets/hexagrams/themes/01/17.jpg'),
  18: require('@/assets/hexagrams/themes/01/18.jpg'),
  19: require('@/assets/hexagrams/themes/01/19.jpg'),
  20: require('@/assets/hexagrams/themes/01/20.jpg'),
  21: require('@/assets/hexagrams/themes/01/21.jpg'),
  22: require('@/assets/hexagrams/themes/01/22.jpg'),
  23: require('@/assets/hexagrams/themes/01/23.jpg'),
  24: require('@/assets/hexagrams/themes/01/24.jpg'),
  25: require('@/assets/hexagrams/themes/01/25.jpg'),
  26: require('@/assets/hexagrams/themes/01/26.jpg'),
  27: require('@/assets/hexagrams/themes/01/27.jpg'),
  28: require('@/assets/hexagrams/themes/01/28.jpg'),
  29: require('@/assets/hexagrams/themes/01/29.jpg'),
  30: require('@/assets/hexagrams/themes/01/30.jpg'),
  31: require('@/assets/hexagrams/themes/01/31.jpg'),
  32: require('@/assets/hexagrams/themes/01/32.jpg'),
  33: require('@/assets/hexagrams/themes/01/33.jpg'),
  34: require('@/assets/hexagrams/themes/01/34.jpg'),
  35: require('@/assets/hexagrams/themes/01/35.jpg'),
  36: require('@/assets/hexagrams/themes/01/36.jpg'),
  37: require('@/assets/hexagrams/themes/01/37.jpg'),
  38: require('@/assets/hexagrams/themes/01/38.jpg'),
  39: require('@/assets/hexagrams/themes/01/39.jpg'),
  40: require('@/assets/hexagrams/themes/01/40.jpg'),
  41: require('@/assets/hexagrams/themes/01/41.jpg'),
  42: require('@/assets/hexagrams/themes/01/42.jpg'),
  43: require('@/assets/hexagrams/themes/01/43.jpg'),
  44: require('@/assets/hexagrams/themes/01/44.jpg'),
  45: require('@/assets/hexagrams/themes/01/45.jpg'),
  46: require('@/assets/hexagrams/themes/01/46.jpg'),
  47: require('@/assets/hexagrams/themes/01/47.jpg'),
  48: require('@/assets/hexagrams/themes/01/48.jpg'),
  49: require('@/assets/hexagrams/themes/01/49.jpg'),
  50: require('@/assets/hexagrams/themes/01/50.jpg'),
  51: require('@/assets/hexagrams/themes/01/51.jpg'),
  52: require('@/assets/hexagrams/themes/01/52.jpg'),
  53: require('@/assets/hexagrams/themes/01/53.jpg'),
  54: require('@/assets/hexagrams/themes/01/54.jpg'),
  55: require('@/assets/hexagrams/themes/01/55.jpg'),
  56: require('@/assets/hexagrams/themes/01/56.jpg'),
  57: require('@/assets/hexagrams/themes/01/57.jpg'),
  58: require('@/assets/hexagrams/themes/01/58.jpg'),
  59: require('@/assets/hexagrams/themes/01/59.jpg'),
  60: require('@/assets/hexagrams/themes/01/60.jpg'),
  61: require('@/assets/hexagrams/themes/01/61.jpg'),
  62: require('@/assets/hexagrams/themes/01/62.jpg'),
  63: require('@/assets/hexagrams/themes/01/63.jpg'),
  64: require('@/assets/hexagrams/themes/01/64.jpg'),
};

const theme02Backgrounds: HexagramBackgrounds = {
  1: require('@/assets/hexagrams/themes/02/01.jpg'),
  2: require('@/assets/hexagrams/themes/02/02.jpg'),
  3: require('@/assets/hexagrams/themes/02/03.jpg'),
  4: require('@/assets/hexagrams/themes/02/04.jpg'),
  5: require('@/assets/hexagrams/themes/02/05.jpg'),
  6: require('@/assets/hexagrams/themes/02/06.jpg'),
  7: require('@/assets/hexagrams/themes/02/07.jpg'),
  8: require('@/assets/hexagrams/themes/02/08.jpg'),
  9: require('@/assets/hexagrams/themes/02/09.jpg'),
  10: require('@/assets/hexagrams/themes/02/10.jpg'),
  11: require('@/assets/hexagrams/themes/02/11.jpg'),
  12: require('@/assets/hexagrams/themes/02/12.jpg'),
  13: require('@/assets/hexagrams/themes/02/13.jpg'),
  14: require('@/assets/hexagrams/themes/02/14.jpg'),
  15: require('@/assets/hexagrams/themes/02/15.jpg'),
  16: require('@/assets/hexagrams/themes/02/16.jpg'),
  17: require('@/assets/hexagrams/themes/02/17.jpg'),
  18: require('@/assets/hexagrams/themes/02/18.jpg'),
  19: require('@/assets/hexagrams/themes/02/19.jpg'),
  20: require('@/assets/hexagrams/themes/02/20.jpg'),
  21: require('@/assets/hexagrams/themes/02/21.jpg'),
  22: require('@/assets/hexagrams/themes/02/22.jpg'),
  23: require('@/assets/hexagrams/themes/02/23.jpg'),
  24: require('@/assets/hexagrams/themes/02/24.jpg'),
  25: require('@/assets/hexagrams/themes/02/25.jpg'),
  26: require('@/assets/hexagrams/themes/02/26.jpg'),
  27: require('@/assets/hexagrams/themes/02/27.jpg'),
  28: require('@/assets/hexagrams/themes/02/28.jpg'),
  29: require('@/assets/hexagrams/themes/02/29.jpg'),
  30: require('@/assets/hexagrams/themes/02/30.jpg'),
  31: require('@/assets/hexagrams/themes/02/31.jpg'),
  32: require('@/assets/hexagrams/themes/02/32.jpg'),
  33: require('@/assets/hexagrams/themes/02/33.jpg'),
  34: require('@/assets/hexagrams/themes/02/34.jpg'),
  35: require('@/assets/hexagrams/themes/02/35.jpg'),
  36: require('@/assets/hexagrams/themes/02/36.jpg'),
  37: require('@/assets/hexagrams/themes/02/37.jpg'),
  38: require('@/assets/hexagrams/themes/02/38.jpg'),
  39: require('@/assets/hexagrams/themes/02/39.jpg'),
  40: require('@/assets/hexagrams/themes/02/40.jpg'),
  41: require('@/assets/hexagrams/themes/02/41.jpg'),
  42: require('@/assets/hexagrams/themes/02/42.jpg'),
  43: require('@/assets/hexagrams/themes/02/43.jpg'),
  44: require('@/assets/hexagrams/themes/02/44.jpg'),
  45: require('@/assets/hexagrams/themes/02/45.jpg'),
  46: require('@/assets/hexagrams/themes/02/46.jpg'),
  47: require('@/assets/hexagrams/themes/02/47.jpg'),
  48: require('@/assets/hexagrams/themes/02/48.jpg'),
  49: require('@/assets/hexagrams/themes/02/49.jpg'),
  50: require('@/assets/hexagrams/themes/02/50.jpg'),
  51: require('@/assets/hexagrams/themes/02/51.jpg'),
  52: require('@/assets/hexagrams/themes/02/52.jpg'),
  53: require('@/assets/hexagrams/themes/02/53.jpg'),
  54: require('@/assets/hexagrams/themes/02/54.jpg'),
  55: require('@/assets/hexagrams/themes/02/55.jpg'),
  56: require('@/assets/hexagrams/themes/02/56.jpg'),
  57: require('@/assets/hexagrams/themes/02/57.jpg'),
  58: require('@/assets/hexagrams/themes/02/58.jpg'),
  59: require('@/assets/hexagrams/themes/02/59.jpg'),
  60: require('@/assets/hexagrams/themes/02/60.jpg'),
  61: require('@/assets/hexagrams/themes/02/61.jpg'),
  62: require('@/assets/hexagrams/themes/02/62.jpg'),
  63: require('@/assets/hexagrams/themes/02/63.jpg'),
  64: require('@/assets/hexagrams/themes/02/64.jpg'),
};

const theme03Backgrounds: HexagramBackgrounds = {
  1: require('@/assets/hexagrams/themes/03/01.jpg'),
  2: require('@/assets/hexagrams/themes/03/02.jpg'),
  3: require('@/assets/hexagrams/themes/03/03.jpg'),
  4: require('@/assets/hexagrams/themes/03/04.jpg'),
  5: require('@/assets/hexagrams/themes/03/05.jpg'),
  6: require('@/assets/hexagrams/themes/03/06.jpg'),
  7: require('@/assets/hexagrams/themes/03/07.jpg'),
  8: require('@/assets/hexagrams/themes/03/08.jpg'),
  9: require('@/assets/hexagrams/themes/03/09.jpg'),
  10: require('@/assets/hexagrams/themes/03/10.jpg'),
  11: require('@/assets/hexagrams/themes/03/11.jpg'),
  12: require('@/assets/hexagrams/themes/03/12.jpg'),
  13: require('@/assets/hexagrams/themes/03/13.jpg'),
  14: require('@/assets/hexagrams/themes/03/14.jpg'),
  15: require('@/assets/hexagrams/themes/03/15.jpg'),
  16: require('@/assets/hexagrams/themes/03/16.jpg'),
  17: require('@/assets/hexagrams/themes/03/17.jpg'),
  18: require('@/assets/hexagrams/themes/03/18.jpg'),
  19: require('@/assets/hexagrams/themes/03/19.jpg'),
  20: require('@/assets/hexagrams/themes/03/20.jpg'),
  21: require('@/assets/hexagrams/themes/03/21.jpg'),
  22: require('@/assets/hexagrams/themes/03/22.jpg'),
  23: require('@/assets/hexagrams/themes/03/23.jpg'),
  24: require('@/assets/hexagrams/themes/03/24.jpg'),
  25: require('@/assets/hexagrams/themes/03/25.jpg'),
  26: require('@/assets/hexagrams/themes/03/26.jpg'),
  27: require('@/assets/hexagrams/themes/03/27.jpg'),
  28: require('@/assets/hexagrams/themes/03/28.jpg'),
  29: require('@/assets/hexagrams/themes/03/29.jpg'),
  30: require('@/assets/hexagrams/themes/03/30.jpg'),
  31: require('@/assets/hexagrams/themes/03/31.jpg'),
  32: require('@/assets/hexagrams/themes/03/32.jpg'),
  33: require('@/assets/hexagrams/themes/03/33.jpg'),
  34: require('@/assets/hexagrams/themes/03/34.jpg'),
  35: require('@/assets/hexagrams/themes/03/35.jpg'),
  36: require('@/assets/hexagrams/themes/03/36.jpg'),
  37: require('@/assets/hexagrams/themes/03/37.jpg'),
  38: require('@/assets/hexagrams/themes/03/38.jpg'),
  39: require('@/assets/hexagrams/themes/03/39.jpg'),
  40: require('@/assets/hexagrams/themes/03/40.jpg'),
  41: require('@/assets/hexagrams/themes/03/41.jpg'),
  42: require('@/assets/hexagrams/themes/03/42.jpg'),
  43: require('@/assets/hexagrams/themes/03/43.jpg'),
  44: require('@/assets/hexagrams/themes/03/44.jpg'),
  45: require('@/assets/hexagrams/themes/03/45.jpg'),
  46: require('@/assets/hexagrams/themes/03/46.jpg'),
  47: require('@/assets/hexagrams/themes/03/47.jpg'),
  48: require('@/assets/hexagrams/themes/03/48.jpg'),
  49: require('@/assets/hexagrams/themes/03/49.jpg'),
  50: require('@/assets/hexagrams/themes/03/50.jpg'),
  51: require('@/assets/hexagrams/themes/03/51.jpg'),
  52: require('@/assets/hexagrams/themes/03/52.jpg'),
  53: require('@/assets/hexagrams/themes/03/53.jpg'),
  54: require('@/assets/hexagrams/themes/03/54.jpg'),
  55: require('@/assets/hexagrams/themes/03/55.jpg'),
  56: require('@/assets/hexagrams/themes/03/56.jpg'),
  57: require('@/assets/hexagrams/themes/03/57.jpg'),
  58: require('@/assets/hexagrams/themes/03/58.jpg'),
  59: require('@/assets/hexagrams/themes/03/59.jpg'),
  60: require('@/assets/hexagrams/themes/03/60.jpg'),
  61: require('@/assets/hexagrams/themes/03/61.jpg'),
  62: require('@/assets/hexagrams/themes/03/62.jpg'),
  63: require('@/assets/hexagrams/themes/03/63.jpg'),
  64: require('@/assets/hexagrams/themes/03/64.jpg'),
};

const theme03AiReadingAvatars: AiReadingAvatarSources = {
  dream_librarian: require('@/assets/hexagrams/themes/03/dream_librarian.jpg'),
  garden_monk: require('@/assets/hexagrams/themes/03/garden_monk.jpg'),
  lantern_oracle: require('@/assets/hexagrams/themes/03/lantern_oracle.jpg'),
  mountain_strategist: require('@/assets/hexagrams/themes/03/mountain_strategist.jpg'),
  river_hermit: require('@/assets/hexagrams/themes/03/river_hermit.jpg'),
  star_cartographer: require('@/assets/hexagrams/themes/03/star_cartographer.jpg'),
  storm_witch: require('@/assets/hexagrams/themes/03/storm_witch.jpg'),
  tea_house_auntie: require('@/assets/hexagrams/themes/03/tea_house_auntie.jpg'),
  temple_poet: require('@/assets/hexagrams/themes/03/temple_poet.jpg'),
  weathered_sage: require('@/assets/hexagrams/themes/03/weathered_sage.jpg'),
};

export const hexagramThemes: Record<HexagramThemeId, HexagramThemeManifest> = {
  '01': {
    id: '01',
    name: 'Ink Mist',
    description: 'Dark ink-wash landscapes, elemental atmosphere, mist, and restrained gold light.',
    isAvailable: true,
    homeBackground: require('@/assets/hexagrams/themes/01/home.jpg'),
    hexagramBackgrounds: theme01Backgrounds,
  },
  '02': {
    id: '02',
    name: 'Soft Wonder',
    description: 'Painterly anime softness, lived-in warmth, emotional weather, and quiet everyday magic.',
    isAvailable: true,
    homeBackground: require('@/assets/hexagrams/themes/02/home.jpg'),
    hexagramBackgrounds: theme02Backgrounds,
  },
  '03': {
    id: '03',
    name: 'Mystical Cats',
    description: 'Hand-painted Japanese storybook cats, moonlit folktale mood, ink wash, mist, and lantern glow.',
    isAvailable: true,
    aiReadingAvatars: theme03AiReadingAvatars,
    homeBackground: require('@/assets/hexagrams/themes/03/home.jpg'),
    hexagramBackgrounds: theme03Backgrounds,
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

export function getAiReadingAvatarSource(
  personalityId: string,
  themeId: HexagramThemeId = defaultHexagramThemeId,
): number | undefined {
  return hexagramThemes[themeId].aiReadingAvatars?.[personalityId];
}

