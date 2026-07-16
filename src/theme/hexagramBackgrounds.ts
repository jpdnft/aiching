import { getDownloadedThemeFileUri } from '@/services/premiumThemes';

export type HexagramThemeId = string;
export type HexagramThemeImageSource = number | string;

export const defaultHexagramThemeId: HexagramThemeId = '02';
export const bundledHexagramThemeIds = ['01', '02'] as const;

type HexagramBackgrounds = Record<number, HexagramThemeImageSource>;
type AiReadingAvatarSources = Record<string, HexagramThemeImageSource>;

export type HexagramThemeManifest = {
  id: HexagramThemeId;
  name: string;
  description: string;
  isAvailable: boolean;
  isPremiumOnly?: boolean;
  aiReadingAvatars?: AiReadingAvatarSources;
  homeBackground?: HexagramThemeImageSource;
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

const theme01AiReadingAvatars: AiReadingAvatarSources = {
  dream_librarian: require('@/assets/hexagrams/themes/01/dream_librarian.jpg'),
  garden_monk: require('@/assets/hexagrams/themes/01/garden_monk.jpg'),
  lantern_oracle: require('@/assets/hexagrams/themes/01/lantern_oracle.jpg'),
  mountain_strategist: require('@/assets/hexagrams/themes/01/mountain_strategist.jpg'),
  river_hermit: require('@/assets/hexagrams/themes/01/river_hermit.jpg'),
  star_cartographer: require('@/assets/hexagrams/themes/01/star_cartographer.jpg'),
  storm_witch: require('@/assets/hexagrams/themes/01/storm_witch.jpg'),
  tea_house_auntie: require('@/assets/hexagrams/themes/01/tea_house_auntie.jpg'),
  temple_poet: require('@/assets/hexagrams/themes/01/temple_poet.jpg'),
  weathered_sage: require('@/assets/hexagrams/themes/01/weathered_sage.jpg'),
};

const theme02AiReadingAvatars: AiReadingAvatarSources = {
  dream_librarian: require('@/assets/hexagrams/themes/02/dream_librarian.jpg'),
  garden_monk: require('@/assets/hexagrams/themes/02/garden_monk.jpg'),
  lantern_oracle: require('@/assets/hexagrams/themes/02/lantern_oracle.jpg'),
  mountain_strategist: require('@/assets/hexagrams/themes/02/mountain_strategist.jpg'),
  river_hermit: require('@/assets/hexagrams/themes/02/river_hermit.jpg'),
  star_cartographer: require('@/assets/hexagrams/themes/02/star_cartographer.jpg'),
  storm_witch: require('@/assets/hexagrams/themes/02/storm_witch.jpg'),
  tea_house_auntie: require('@/assets/hexagrams/themes/02/tea_house_auntie.jpg'),
  temple_poet: require('@/assets/hexagrams/themes/02/temple_poet.jpg'),
  weathered_sage: require('@/assets/hexagrams/themes/02/weathered_sage.jpg'),
};

export const hexagramThemes: Record<string, HexagramThemeManifest> = {
  '01': {
    id: '01',
    name: 'Ink Mist',
    description: 'Dark ink-wash landscapes, elemental atmosphere, mist, and restrained gold light.',
    isAvailable: true,
    aiReadingAvatars: theme01AiReadingAvatars,
    homeBackground: require('@/assets/hexagrams/themes/01/home.jpg'),
    hexagramBackgrounds: theme01Backgrounds,
  },
  '02': {
    id: '02',
    name: 'Soft Wonder',
    description: 'Painterly anime softness, lived-in warmth, emotional weather, and quiet everyday magic.',
    isAvailable: true,
    aiReadingAvatars: theme02AiReadingAvatars,
    homeBackground: require('@/assets/hexagrams/themes/02/home.jpg'),
    hexagramBackgrounds: theme02Backgrounds,
  },
  '03': {
    id: '03',
    name: 'Mystical Cats',
    description: 'Hand-painted Japanese storybook cats, moonlit folktale mood, ink wash, mist, and lantern glow.',
    isAvailable: false,
    isPremiumOnly: true,
  },
  '04': {
    id: '04',
    name: 'Donghua Cultivation Fantasy',
    description:
      'Chinese donghua-inspired xianxia and wuxia fantasy, with cultivators, immortals, luminous qi, cloud seas, jade pavilions, ink-wash textures, and cinematic spiritual adventure.',
    isAvailable: false,
    isPremiumOnly: true,
  },
  '05': {
    id: '05',
    name: 'Solar Punk Hermitage',
    description:
      'A luminous future of ecological temples, mountain greenhouses, sun mirrors, water gardens, hand-built machines, oracle engineers, and sacred low-tech abundance.',
    isAvailable: false,
    isPremiumOnly: true,
  },
  '06': {
    id: '06',
    name: 'Hanfu Fashion Inspiration',
    description:
      'A modern I Ching theme inspired by the contemporary Hanfu revival, blending recognizable historical Chinese silhouettes with wearable urban streetwear and symbolic city scenes.',
    isAvailable: false,
    isPremiumOnly: true,
  },
  '07': {
    id: '07',
    name: 'Liminal Spaces',
    description:
      'A photoreal cinematic theme of quiet thresholds, empty corridors, half-lit stations, abandoned courtyards, misty passages, flooded rooms, and surreal in-between places.',
    isAvailable: false,
    isPremiumOnly: true,
  },
  '08': {
    id: '08',
    name: 'Adorable Pandas',
    description:
      'A whimsical I Ching theme of adorable panda bears in symbolic bamboo forests, moonlit gardens, tiny temples, mountain paths, tea houses, and enchanted everyday moments.',
    isAvailable: false,
    isPremiumOnly: true,
  },
};

export const hexagramThemeList = Object.values(hexagramThemes);

export function isHexagramThemeId(value: string | null | undefined): value is HexagramThemeId {
  return typeof value === 'string' && /^(0[1-9]|[1-9][0-9])$/.test(value);
}

export function isBundledHexagramTheme(themeId: HexagramThemeId): boolean {
  return bundledHexagramThemeIds.includes(themeId as (typeof bundledHexagramThemeIds)[number]);
}

export function isHexagramThemeAvailable(themeId: HexagramThemeId, installedThemeIds: string[] = []): boolean {
  return isBundledHexagramTheme(themeId) || installedThemeIds.includes(themeId);
}

export function isHexagramThemePremiumOnly(themeId: HexagramThemeId): boolean {
  return !isBundledHexagramTheme(themeId);
}

export function getThemeName(themeId: HexagramThemeId): string {
  return hexagramThemes[themeId]?.name ?? `Theme ${themeId}`;
}

export function getHexagramBackgroundSource(
  hexagramNumber: number,
  themeId: HexagramThemeId = defaultHexagramThemeId,
): HexagramThemeImageSource | undefined {
  if (isBundledHexagramTheme(themeId)) {
    return hexagramThemes[themeId].hexagramBackgrounds?.[hexagramNumber];
  }

  return getDownloadedThemeFileUri(themeId, `${String(hexagramNumber).padStart(2, '0')}.jpg`);
}

export function getHomeBackgroundSource(
  themeId: HexagramThemeId = defaultHexagramThemeId,
): HexagramThemeImageSource | undefined {
  if (isBundledHexagramTheme(themeId)) {
    return hexagramThemes[themeId].homeBackground;
  }

  return getDownloadedThemeFileUri(themeId, 'home.jpg');
}

export function getAiReadingAvatarSource(
  personalityId: string,
  themeId: HexagramThemeId = defaultHexagramThemeId,
): HexagramThemeImageSource | undefined {
  if (isBundledHexagramTheme(themeId)) {
    return hexagramThemes[themeId].aiReadingAvatars?.[personalityId];
  }

  return getDownloadedThemeFileUri(themeId, `${personalityId}.jpg`);
}
