import { mockPaymentsProvider } from './mockProvider';
import { revenuecatPaymentsProvider } from './revenuecatProvider';
import type { PaymentsProvider } from './types';

export * from './types';

const hasRevenueCatKey = Boolean(process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY);

export const paymentsProvider: PaymentsProvider = hasRevenueCatKey ? revenuecatPaymentsProvider : mockPaymentsProvider;
