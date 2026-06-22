import { Platform } from 'react-native';

export const revenueCatConfig = {
  entitlementId: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID || 'premium',
  androidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
};

export function getRevenueCatApiKey(): string | null {
  if (Platform.OS === 'android') {
    return revenueCatConfig.androidApiKey || null;
  }

  return null;
}
