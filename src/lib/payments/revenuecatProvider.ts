// Live provider stub. Not wired up yet — EXPO_PUBLIC_REVENUECAT_IOS_KEY /
// EXPO_PUBLIC_REVENUECAT_ANDROID_KEY are unset, so `getPaymentsProvider()`
// in ./index.ts returns the mock provider (backed by the Supabase
// `subscriptions` table) instead.
//
// A RevenueCat *secret* key was provided during setup and stored server-side
// in .env as REVENUECAT_SECRET_KEY — that key is for server-to-server REST
// calls (e.g. a webhook handler reconciling entitlements into Supabase) and
// must never be used here. The mobile SDK needs separate PUBLIC per-platform
// keys (appl_... / goog_...) from RevenueCat dashboard > Project Settings >
// API Keys.
//
// To go live:
//   1. `npm install react-native-purchases` and run `npx expo prebuild`
//      (native module, not available in Expo Go).
//   2. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY.
//   3. Call Purchases.configure() once at app startup with the platform key.
//   4. Implement getEntitlement/purchase/restorePurchases against
//      Purchases.getCustomerInfo() / Purchases.purchasePackage() / Purchases.restorePurchases().
//   5. Add a Supabase Edge Function webhook (using REVENUECAT_SECRET_KEY) so
//      entitlement changes from the App Store / Play Store sync into the
//      `subscriptions` table even when the app isn't open.

import type { PaymentsProvider } from './types';

export const revenuecatPaymentsProvider: PaymentsProvider = {
  async getEntitlement() {
    throw new Error('RevenueCat provider is not implemented yet. See comments in revenuecatProvider.ts.');
  },
  async purchase() {
    throw new Error('RevenueCat provider is not implemented yet. See comments in revenuecatProvider.ts.');
  },
  async restorePurchases() {
    throw new Error('RevenueCat provider is not implemented yet. See comments in revenuecatProvider.ts.');
  },
};
