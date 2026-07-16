import type { HexagramThemeId } from '@/theme/hexagramBackgrounds';

type ThemeCardDescription = {
  hexagramNumber: number;
  name: string;
  description: string;
};

type ThemeCardDescriptions = Record<string, ThemeCardDescription>;

const descriptionsByThemeId: Record<string, ThemeCardDescriptions> = {
  '01': require('./theme_card_data/01/card_descriptions.json'),
  '02': require('./theme_card_data/02/card_descriptions.json'),
  '03': require('./theme_card_data/03/card_descriptions.json'),
  '04': require('./theme_card_data/04/card_descriptions.json'),
  '05': require('./theme_card_data/05/card_descriptions.json'),
  '06': require('./theme_card_data/06/card_descriptions.json'),
  '07': require('./theme_card_data/07/card_descriptions.json'),
  '08': require('./theme_card_data/08/card_descriptions.json'),
};

export function getThemeCardDescription(
  themeId: HexagramThemeId,
  hexagramNumber: number,
): ThemeCardDescription | undefined {
  const key = String(hexagramNumber).padStart(2, '0');

  return descriptionsByThemeId[themeId]?.[key];
}
