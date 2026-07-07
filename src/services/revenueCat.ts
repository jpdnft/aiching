import { Platform } from 'react-native';

import { getRevenueCatApiKey, revenueCatConfig } from '@/config/revenueCat';

type RevenueCatAvailability =
  | 'configured'
  | 'not_configured'
  | 'unsupported_platform'
  | 'unavailable';

export type RevenueCatState = {
  availability: RevenueCatAvailability;
  errorMessage?: string;
  isPremium: boolean;
};

let didConfigureRevenueCat = false;

export function getDefaultRevenueCatState(): RevenueCatState {
  return {
    availability: Platform.OS === 'android' ? 'not_configured' : 'unsupported_platform',
    isPremium: false,
  };
}

export async function loadRevenueCatState(): Promise<RevenueCatState> {
  const setup = await ensureRevenueCatConfigured();

  if (!setup.configured || !setup.Purchases) {
    return {
      availability: setup.availability,
      errorMessage: setup.errorMessage,
      isPremium: false,
    };
  }

  try {
    const customerInfo = await setup.Purchases.getCustomerInfo();

    return {
      availability: 'configured',
      isPremium: hasPremiumEntitlement(customerInfo),
    };
  } catch (error) {
    return {
      availability: 'unavailable',
      errorMessage: getErrorMessage(error),
      isPremium: false,
    };
  }
}

export async function presentRevenueCatPaywall(): Promise<RevenueCatState> {
  const setup = await ensureRevenueCatConfigured();

  if (!setup.configured || !setup.Purchases) {
    return {
      availability: setup.availability,
      errorMessage: setup.errorMessage,
      isPremium: false,
    };
  }

  try {
    const revenueCatUiModule = await import('react-native-purchases-ui');
    const RevenueCatUI = revenueCatUiModule.default;

    await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
    });
  } catch (error) {
    return {
      availability: 'unavailable',
      errorMessage: getErrorMessage(error),
      isPremium: false,
    };
  }

  return loadRevenueCatState();
}

export async function restoreRevenueCatPurchases(): Promise<RevenueCatState> {
  const setup = await ensureRevenueCatConfigured();

  if (!setup.configured || !setup.Purchases) {
    return {
      availability: setup.availability,
      errorMessage: setup.errorMessage,
      isPremium: false,
    };
  }

  try {
    const customerInfo = await setup.Purchases.restorePurchases();

    return {
      availability: 'configured',
      isPremium: hasPremiumEntitlement(customerInfo),
    };
  } catch (error) {
    return {
      availability: 'unavailable',
      errorMessage: getErrorMessage(error),
      isPremium: false,
    };
  }
}

export async function getRevenueCatAppUserId(): Promise<string | null> {
  const setup = await ensureRevenueCatConfigured();

  if (!setup.configured || !setup.Purchases) {
    return null;
  }

  try {
    if (typeof setup.Purchases.getAppUserID === 'function') {
      return await setup.Purchases.getAppUserID();
    }

    return null;
  } catch {
    return null;
  }
}

export async function presentRevenueCatCustomerCenter(): Promise<RevenueCatState> {
  const setup = await ensureRevenueCatConfigured();

  if (!setup.configured || !setup.Purchases) {
    return {
      availability: setup.availability,
      errorMessage: setup.errorMessage,
      isPremium: false,
    };
  }

  try {
    const revenueCatUiModule = await import('react-native-purchases-ui');
    const RevenueCatUI = revenueCatUiModule.default;

    if (typeof RevenueCatUI.presentCustomerCenter === 'function') {
      await RevenueCatUI.presentCustomerCenter();
    } else {
      await setup.Purchases.showManageSubscriptions();
    }
  } catch (error) {
    return {
      availability: 'unavailable',
      errorMessage: getErrorMessage(error),
      isPremium: false,
    };
  }

  return loadRevenueCatState();
}

async function ensureRevenueCatConfigured(): Promise<{
  availability: RevenueCatAvailability;
  configured: boolean;
  errorMessage?: string;
  Purchases?: any;
}> {
  if (Platform.OS !== 'android') {
    return {
      availability: 'unsupported_platform',
      configured: false,
    };
  }

  const apiKey = getRevenueCatApiKey();

  if (!apiKey) {
    return {
      availability: 'not_configured',
      configured: false,
    };
  }

  try {
    const purchasesModule = await import('react-native-purchases');
    const Purchases = purchasesModule.default;

    if (!didConfigureRevenueCat) {
      if (__DEV__ && purchasesModule.LOG_LEVEL) {
        Purchases.setLogLevel(purchasesModule.LOG_LEVEL.DEBUG);
      }

      Purchases.configure({ apiKey });
      didConfigureRevenueCat = true;
    }

    return {
      availability: 'configured',
      configured: true,
      Purchases,
    };
  } catch (error) {
    return {
      availability: 'unavailable',
      configured: false,
      errorMessage: getErrorMessage(error),
    };
  }
}

function hasPremiumEntitlement(customerInfo: any): boolean {
  return Boolean(customerInfo?.entitlements?.active?.[revenueCatConfig.entitlementId]);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'RevenueCat is unavailable.';
}
