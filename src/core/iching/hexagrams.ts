import { Hexagram } from './types';

export type HexagramSummary = Pick<Hexagram, 'number' | 'name' | 'binaryKey'>;

export const hexagramSummaries: HexagramSummary[] = [
  { number: 1, name: 'The Creative', binaryKey: '111111' },
  { number: 2, name: 'The Receptive', binaryKey: '000000' },
  { number: 3, name: 'Difficulty at the Beginning', binaryKey: '100010' },
  { number: 4, name: 'Youthful Folly', binaryKey: '010001' },
  { number: 5, name: 'Waiting', binaryKey: '111010' },
  { number: 6, name: 'Conflict', binaryKey: '010111' },
  { number: 7, name: 'The Army', binaryKey: '010000' },
  { number: 8, name: 'Holding Together', binaryKey: '000010' },
  { number: 9, name: 'Small Taming', binaryKey: '111011' },
  { number: 10, name: 'Treading', binaryKey: '110111' },
  { number: 11, name: 'Peace', binaryKey: '111000' },
  { number: 12, name: 'Standstill', binaryKey: '000111' },
  { number: 13, name: 'Fellowship', binaryKey: '101111' },
  { number: 14, name: 'Great Possession', binaryKey: '111101' },
  { number: 15, name: 'Modesty', binaryKey: '001000' },
  { number: 16, name: 'Enthusiasm', binaryKey: '000100' },
  { number: 17, name: 'Following', binaryKey: '100110' },
  { number: 18, name: 'Work on What Has Been Spoiled', binaryKey: '011001' },
  { number: 19, name: 'Approach', binaryKey: '110000' },
  { number: 20, name: 'Contemplation', binaryKey: '000011' },
  { number: 21, name: 'Biting Through', binaryKey: '100101' },
  { number: 22, name: 'Grace', binaryKey: '101001' },
  { number: 23, name: 'Splitting Apart', binaryKey: '000001' },
  { number: 24, name: 'Return', binaryKey: '100000' },
  { number: 25, name: 'Innocence', binaryKey: '100111' },
  { number: 26, name: 'Great Taming', binaryKey: '111001' },
  { number: 27, name: 'Nourishment', binaryKey: '100001' },
  { number: 28, name: 'Great Preponderance', binaryKey: '011110' },
  { number: 29, name: 'The Abysmal', binaryKey: '010010' },
  { number: 30, name: 'Radiance', binaryKey: '101101' },
  { number: 31, name: 'Influence', binaryKey: '001110' },
  { number: 32, name: 'Duration', binaryKey: '011100' },
  { number: 33, name: 'Retreat', binaryKey: '001111' },
  { number: 34, name: 'Great Power', binaryKey: '111100' },
  { number: 35, name: 'Progress', binaryKey: '000101' },
  { number: 36, name: 'Darkening of the Light', binaryKey: '101000' },
  { number: 37, name: 'The Family', binaryKey: '101011' },
  { number: 38, name: 'Opposition', binaryKey: '110101' },
  { number: 39, name: 'Obstruction', binaryKey: '001010' },
  { number: 40, name: 'Deliverance', binaryKey: '010100' },
  { number: 41, name: 'Decrease', binaryKey: '110001' },
  { number: 42, name: 'Increase', binaryKey: '100011' },
  { number: 43, name: 'Breakthrough', binaryKey: '111110' },
  { number: 44, name: 'Coming to Meet', binaryKey: '011111' },
  { number: 45, name: 'Gathering Together', binaryKey: '000110' },
  { number: 46, name: 'Pushing Upward', binaryKey: '011000' },
  { number: 47, name: 'Oppression', binaryKey: '010110' },
  { number: 48, name: 'The Well', binaryKey: '011010' },
  { number: 49, name: 'Revolution', binaryKey: '101110' },
  { number: 50, name: 'The Cauldron', binaryKey: '011101' },
  { number: 51, name: 'The Arousing', binaryKey: '100100' },
  { number: 52, name: 'Keeping Still', binaryKey: '001001' },
  { number: 53, name: 'Development', binaryKey: '001011' },
  { number: 54, name: 'The Marrying Maiden', binaryKey: '110100' },
  { number: 55, name: 'Abundance', binaryKey: '101100' },
  { number: 56, name: 'The Wanderer', binaryKey: '001101' },
  { number: 57, name: 'The Gentle', binaryKey: '011011' },
  { number: 58, name: 'The Joyous', binaryKey: '110110' },
  { number: 59, name: 'Dispersion', binaryKey: '010011' },
  { number: 60, name: 'Limitation', binaryKey: '110010' },
  { number: 61, name: 'Inner Truth', binaryKey: '110011' },
  { number: 62, name: 'Small Preponderance', binaryKey: '001100' },
  { number: 63, name: 'After Completion', binaryKey: '101010' },
  { number: 64, name: 'Before Completion', binaryKey: '010101' },
];

export function getHexagramByNumber(number: number): Hexagram {
  switch (number) {
    case 1:
      return require('./data/hexagrams/01.json');
    case 2:
      return require('./data/hexagrams/02.json');
    case 3:
      return require('./data/hexagrams/03.json');
    case 4:
      return require('./data/hexagrams/04.json');
    case 5:
      return require('./data/hexagrams/05.json');
    case 6:
      return require('./data/hexagrams/06.json');
    case 7:
      return require('./data/hexagrams/07.json');
    case 8:
      return require('./data/hexagrams/08.json');
    case 9:
      return require('./data/hexagrams/09.json');
    case 10:
      return require('./data/hexagrams/10.json');
    case 11:
      return require('./data/hexagrams/11.json');
    case 12:
      return require('./data/hexagrams/12.json');
    case 13:
      return require('./data/hexagrams/13.json');
    case 14:
      return require('./data/hexagrams/14.json');
    case 15:
      return require('./data/hexagrams/15.json');
    case 16:
      return require('./data/hexagrams/16.json');
    case 17:
      return require('./data/hexagrams/17.json');
    case 18:
      return require('./data/hexagrams/18.json');
    case 19:
      return require('./data/hexagrams/19.json');
    case 20:
      return require('./data/hexagrams/20.json');
    case 21:
      return require('./data/hexagrams/21.json');
    case 22:
      return require('./data/hexagrams/22.json');
    case 23:
      return require('./data/hexagrams/23.json');
    case 24:
      return require('./data/hexagrams/24.json');
    case 25:
      return require('./data/hexagrams/25.json');
    case 26:
      return require('./data/hexagrams/26.json');
    case 27:
      return require('./data/hexagrams/27.json');
    case 28:
      return require('./data/hexagrams/28.json');
    case 29:
      return require('./data/hexagrams/29.json');
    case 30:
      return require('./data/hexagrams/30.json');
    case 31:
      return require('./data/hexagrams/31.json');
    case 32:
      return require('./data/hexagrams/32.json');
    case 33:
      return require('./data/hexagrams/33.json');
    case 34:
      return require('./data/hexagrams/34.json');
    case 35:
      return require('./data/hexagrams/35.json');
    case 36:
      return require('./data/hexagrams/36.json');
    case 37:
      return require('./data/hexagrams/37.json');
    case 38:
      return require('./data/hexagrams/38.json');
    case 39:
      return require('./data/hexagrams/39.json');
    case 40:
      return require('./data/hexagrams/40.json');
    case 41:
      return require('./data/hexagrams/41.json');
    case 42:
      return require('./data/hexagrams/42.json');
    case 43:
      return require('./data/hexagrams/43.json');
    case 44:
      return require('./data/hexagrams/44.json');
    case 45:
      return require('./data/hexagrams/45.json');
    case 46:
      return require('./data/hexagrams/46.json');
    case 47:
      return require('./data/hexagrams/47.json');
    case 48:
      return require('./data/hexagrams/48.json');
    case 49:
      return require('./data/hexagrams/49.json');
    case 50:
      return require('./data/hexagrams/50.json');
    case 51:
      return require('./data/hexagrams/51.json');
    case 52:
      return require('./data/hexagrams/52.json');
    case 53:
      return require('./data/hexagrams/53.json');
    case 54:
      return require('./data/hexagrams/54.json');
    case 55:
      return require('./data/hexagrams/55.json');
    case 56:
      return require('./data/hexagrams/56.json');
    case 57:
      return require('./data/hexagrams/57.json');
    case 58:
      return require('./data/hexagrams/58.json');
    case 59:
      return require('./data/hexagrams/59.json');
    case 60:
      return require('./data/hexagrams/60.json');
    case 61:
      return require('./data/hexagrams/61.json');
    case 62:
      return require('./data/hexagrams/62.json');
    case 63:
      return require('./data/hexagrams/63.json');
    case 64:
      return require('./data/hexagrams/64.json');
    default:
      throw new Error(`No hexagram found for number ${number}`);
  }
}
