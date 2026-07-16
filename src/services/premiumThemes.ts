import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import JSZip from 'jszip';

import { aiReadingPersonalities } from '@/core/aiReadings/personalities';

const INSTALLED_THEMES_STORAGE_KEY = 'aiching.premiumThemes.installed.v1';
const THEME_STORAGE_ROOT = `${FileSystem.documentDirectory ?? ''}assets/hexagrams/themes`;

const requiredPersonalityFiles = aiReadingPersonalities.map((personality) => `${personality.id}.jpg`);
const requiredHexagramFiles = Array.from({ length: 64 }, (_, index) => `${String(index + 1).padStart(2, '0')}.jpg`);

export type PremiumThemePack = {
  themeId: string;
  name: string;
  description?: string;
  packUrl: string;
  sha256?: string;
  sizeBytes?: number;
};

type ThemePackManifest = {
  schemaVersion: 1;
  themeId: string;
  name: string;
  description?: string;
  tier: 'premium';
  version: string;
  imageFormat: 'jpg';
  files?: {
    home?: string;
    hexagrams?: string[];
    personalities?: string[];
  };
};

export type PremiumThemeInstallResult = {
  themeId: string;
  installedFileCount: number;
};

export const premiumThemePacks: PremiumThemePack[] = [
  {
    themeId: '03',
    name: 'Mystical Cats',
    description: 'Hand-painted Japanese storybook cats, moonlit folktale mood, ink wash, mist, and lantern glow.',
    packUrl: 'https://jpd3.com/iching/premium-themes/03/03.zip',
  },
  {
    themeId: '04',
    name: 'Donghua Cultivation Fantasy',
    description:
      'Chinese donghua-inspired xianxia and wuxia fantasy, with cultivators, immortals, luminous qi, cloud seas, jade pavilions, ink-wash textures, and cinematic spiritual adventure.',
    packUrl: 'https://jpd3.com/iching/premium-themes/04/04.zip',
  },
  {
    themeId: '05',
    name: 'Solar Punk Hermitage',
    description:
      'A luminous future of ecological temples, mountain greenhouses, sun mirrors, water gardens, hand-built machines, oracle engineers, and sacred low-tech abundance.',
    packUrl: 'https://jpd3.com/iching/premium-themes/05/05.zip',
  },
  {
    themeId: '06',
    name: 'Hanfu Fashion Inspiration',
    description:
      'A modern I Ching theme inspired by the contemporary Hanfu revival, blending recognizable historical Chinese silhouettes with wearable urban streetwear and symbolic city scenes.',
    packUrl: 'https://jpd3.com/iching/premium-themes/06/06.zip',
  },
  {
    themeId: '07',
    name: 'Liminal Spaces',
    description:
      'A photoreal cinematic theme of quiet thresholds, empty corridors, half-lit stations, abandoned courtyards, misty passages, flooded rooms, and surreal in-between places.',
    packUrl: 'https://jpd3.com/iching/premium-themes/07/07.zip',
  },
  {
    themeId: '08',
    name: 'Adorable Pandas',
    description:
      'A whimsical I Ching theme of adorable panda bears in symbolic bamboo forests, moonlit gardens, tiny temples, mountain paths, tea houses, and enchanted everyday moments.',
    packUrl: 'https://jpd3.com/iching/premium-themes/08/08.zip',
  },
];

export function getDownloadedThemeFileUri(themeId: string, filename: string): string {
  return `${THEME_STORAGE_ROOT}/${themeId}/${filename}`;
}

export async function loadInstalledPremiumThemeIds(): Promise<string[]> {
  const storedValue = await AsyncStorage.getItem(INSTALLED_THEMES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedValue);

    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => isPremiumThemeId(value));
    }
  } catch {
    return [];
  }

  return [];
}

export async function markPremiumThemeInstalled(themeId: string): Promise<string[]> {
  const installedThemeIds = await loadInstalledPremiumThemeIds();
  const nextThemeIds = [...new Set([...installedThemeIds, themeId])].sort();
  await AsyncStorage.setItem(INSTALLED_THEMES_STORAGE_KEY, JSON.stringify(nextThemeIds));
  return nextThemeIds;
}

export async function installPremiumThemePack(
  themePack: PremiumThemePack,
): Promise<PremiumThemeInstallResult> {
  validateThemePack(themePack);

  const cacheDirectory = FileSystem.cacheDirectory;

  if (!cacheDirectory) {
    throw new Error('Theme downloads are not available on this device.');
  }

  const downloadPath = `${cacheDirectory}premium-theme-${themePack.themeId}.zip`;
  const downloadResult = await FileSystem.downloadAsync(themePack.packUrl, downloadPath);

  if (downloadResult.status && downloadResult.status >= 400) {
    throw new Error(`Theme download failed (${downloadResult.status}).`);
  }

  const downloadInfo = await FileSystem.getInfoAsync(downloadPath);

  if (!downloadInfo.exists) {
    throw new Error('Theme download did not create a local file.');
  }

  if (themePack.sizeBytes && downloadInfo.size !== themePack.sizeBytes) {
    throw new Error('Theme download size did not match the expected size.');
  }

  const base64Zip = await FileSystem.readAsStringAsync(downloadPath, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const zip = await JSZip.loadAsync(base64Zip, { base64: true });
  const manifest = await readThemePackManifest(zip, themePack.themeId);
  validateThemePackManifest(manifest, themePack);
  validateThemePackEntries(zip, themePack.themeId, manifest);

  const themeDirectory = `${THEME_STORAGE_ROOT}/${themePack.themeId}`;
  await FileSystem.deleteAsync(themeDirectory, { idempotent: true });
  await FileSystem.makeDirectoryAsync(themeDirectory, { intermediates: true });

  const filesToInstall = getRequiredPackFiles(manifest);

  await Promise.all(
    filesToInstall.map(async (filename) => {
      const zipFile = zip.file(filename);

      if (!zipFile) {
        throw new Error(`Theme pack is missing ${filename}.`);
      }

      const imageBase64 = await zipFile.async('base64');
      await FileSystem.writeAsStringAsync(`${themeDirectory}/${filename}`, imageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }),
  );

  await FileSystem.writeAsStringAsync(
    `${themeDirectory}/manifest.json`,
    JSON.stringify(manifest, null, 2),
    { encoding: FileSystem.EncodingType.UTF8 },
  );
  await markPremiumThemeInstalled(themePack.themeId);
  await FileSystem.deleteAsync(downloadPath, { idempotent: true });

  return {
    themeId: themePack.themeId,
    installedFileCount: filesToInstall.length,
  };
}

export function isPremiumThemeId(value: string): boolean {
  return /^(0[3-9]|[1-9][0-9])$/.test(value);
}

function validateThemePack(themePack: PremiumThemePack): void {
  if (!isPremiumThemeId(themePack.themeId)) {
    throw new Error('Premium theme ID must be 03 through 99.');
  }

  if (!themePack.packUrl.startsWith('https://')) {
    throw new Error('Premium theme pack URLs must use HTTPS.');
  }

  if (themePack.sha256 && !/^[a-f0-9]{64}$/i.test(themePack.sha256)) {
    throw new Error('Premium theme pack is missing a valid SHA-256 hash.');
  }

  if (themePack.sizeBytes && (!Number.isFinite(themePack.sizeBytes) || themePack.sizeBytes <= 0)) {
    throw new Error('Premium theme pack is missing a valid sizeBytes value.');
  }
}

async function readThemePackManifest(zip: JSZip, themeId: string): Promise<ThemePackManifest> {
  const manifestFile = zip.file('manifest.json');

  if (!manifestFile) {
    throw new Error('Theme pack is missing manifest.json.');
  }

  const manifestText = await manifestFile.async('text');

  try {
    return JSON.parse(manifestText) as ThemePackManifest;
  } catch {
    throw new Error('Theme pack manifest is not valid JSON.');
  }
}

function validateThemePackManifest(
  manifest: ThemePackManifest,
  themePack: PremiumThemePack,
): void {
  if (
    manifest.schemaVersion !== 1 ||
    manifest.themeId !== themePack.themeId ||
    manifest.tier !== 'premium' ||
    manifest.imageFormat !== 'jpg'
  ) {
    throw new Error('Theme pack manifest does not match the expected format.');
  }

  validateFlatJpgFilenames(getRequiredPackFiles(manifest));
}

function validateThemePackEntries(zip: JSZip, _themeId: string, manifest: ThemePackManifest): void {
  for (const entryName of Object.keys(zip.files)) {
    if (entryName.includes('/') || entryName.includes('\\') || entryName.includes('..')) {
      throw new Error('Theme pack contains an invalid file path.');
    }
  }

  for (const filename of getRequiredPackFiles(manifest)) {
    const zipFile = zip.file(filename);

    if (!zipFile) {
      throw new Error(`Theme pack is missing ${filename}.`);
    }
  }
}

function getRequiredPackFiles(manifest: ThemePackManifest): string[] {
  const manifestPersonalityFiles = manifest.files?.personalities;
  const personalityFiles =
    Array.isArray(manifestPersonalityFiles) && manifestPersonalityFiles.length
      ? manifestPersonalityFiles
      : requiredPersonalityFiles;

  return ['home.jpg', ...requiredHexagramFiles, ...personalityFiles];
}

function validateFlatJpgFilenames(filenames: string[]): void {
  for (const filename of filenames) {
    if (filename.includes('/') || filename.includes('\\') || !filename.endsWith('.jpg')) {
      throw new Error('Theme pack images must be flat .jpg files.');
    }
  }
}
