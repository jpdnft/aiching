import { BasicLine, Hexagram } from './types';

const names = [
  'The Creative',
  'The Receptive',
  'Difficulty at the Beginning',
  'Youthful Folly',
  'Waiting',
  'Conflict',
  'The Army',
  'Holding Together',
  'Small Taming',
  'Treading',
  'Peace',
  'Standstill',
  'Fellowship',
  'Great Possession',
  'Modesty',
  'Enthusiasm',
  'Following',
  'Work on What Has Been Spoiled',
  'Approach',
  'Contemplation',
  'Biting Through',
  'Grace',
  'Splitting Apart',
  'Return',
  'Innocence',
  'Great Taming',
  'Nourishment',
  'Great Preponderance',
  'The Abysmal',
  'Radiance',
  'Influence',
  'Duration',
  'Retreat',
  'Great Power',
  'Progress',
  'Darkening of the Light',
  'The Family',
  'Opposition',
  'Obstruction',
  'Deliverance',
  'Decrease',
  'Increase',
  'Breakthrough',
  'Coming to Meet',
  'Gathering Together',
  'Pushing Upward',
  'Oppression',
  'The Well',
  'Revolution',
  'The Cauldron',
  'The Arousing',
  'Keeping Still',
  'Development',
  'The Marrying Maiden',
  'Abundance',
  'The Wanderer',
  'The Gentle',
  'The Joyous',
  'Dispersion',
  'Limitation',
  'Inner Truth',
  'Small Preponderance',
  'After Completion',
  'Before Completion',
];

function linesFromKey(binaryKey: string): BasicLine[] {
  return binaryKey.split('').map((value) => (value === '1' ? 'yang' : 'yin'));
}

function makeHexagram(binaryKey: string, index: number): Hexagram {
  const number = index + 1;
  const name = names[index] ?? `Hexagram ${number}`;

  return {
    number,
    name,
    binaryKey,
    lines: linesFromKey(binaryKey),
    keywords: ['reflection', 'timing', 'attention'],
    theme: `${name} points toward a pattern worth meeting with patience and clarity.`,
    basicInterpretation:
      'This reading invites you to pause, observe the shape of the moment, and respond with steadiness rather than certainty.',
    reflectionPrompt: 'What is asking for your clearest attention today?',
  };
}

// TODO: Replace placeholder interpretations with curated text for each traditional hexagram.
export const hexagrams: Hexagram[] = Array.from({ length: 64 }, (_, index) =>
  makeHexagram(index.toString(2).padStart(6, '0'), index),
);
