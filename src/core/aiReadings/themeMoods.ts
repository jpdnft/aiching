export type AiReadingThemeMood = {
  id: string;
  name: string;
  instruction: string;
};

const defaultThemeMood: AiReadingThemeMood = {
  id: '02',
  name: 'Soft Wonder',
  instruction:
    'Let the atmosphere feel gently wondrous, emotionally warm, and quietly magical. Favor approachable language, soft surprise, and a sense that ordinary life can still hold enchantment.',
};

const themeMoods: Record<string, AiReadingThemeMood> = {
  '01': {
    id: '01',
    name: 'Ink Mist',
    instruction:
      'Let the atmosphere feel zen-like, spare, misted, elemental, and contemplative. Favor restraint, stillness, clean images, and a sense of quiet depth.',
  },
  '02': defaultThemeMood,
  '03': {
    id: '03',
    name: 'Mystical Cats',
    instruction:
      'Let the atmosphere feel whimsical, moonlit, curious, and storybook-mystical. A light touch of mischief or feline watchfulness is welcome, but keep the guidance sincere and useful.',
  },
};

export function getAiReadingThemeMood(themeId: string | null | undefined): AiReadingThemeMood {
  return themeMoods[themeId ?? ''] ?? defaultThemeMood;
}
