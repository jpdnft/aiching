export type AppColorMode = 'dark' | 'light';

export type AiChingColorPalette = {
  ink: string;
  inkSoft: string;
  surface: string;
  surfaceSoft: string;
  gold: string;
  goldDeep: string;
  mist: string;
  muted: string;
  paper: string;
  paperLine: string;
  danger: string;
};

export const aiChingDarkColors: AiChingColorPalette = {
  ink: '#101318',
  inkSoft: '#171c22',
  surface: '#202730',
  surfaceSoft: '#2c3540',
  gold: '#e7c56f',
  goldDeep: '#7c4f18',
  mist: '#dbe2df',
  muted: '#9fa9a6',
  paper: '#f6f1e8',
  paperLine: '#d8c7ad',
  danger: '#c86755',
};

export const aiChingLightColors: AiChingColorPalette = {
  ink: '#f7f1e7',
  inkSoft: '#ede1cf',
  surface: '#fffaf0',
  surfaceSoft: '#eadcc5',
  gold: '#8b5d1d',
  goldDeep: '#5f3a0f',
  mist: '#24201a',
  muted: '#6f6659',
  paper: '#15120e',
  paperLine: '#c8ad7c',
  danger: '#9b4237',
};

export const aiChingColors = aiChingDarkColors;

export const aiChingPalettes: Record<AppColorMode, AiChingColorPalette> = {
  dark: aiChingDarkColors,
  light: aiChingLightColors,
};

export function getAiChingColors(colorMode: AppColorMode): AiChingColorPalette {
  return aiChingPalettes[colorMode];
}
