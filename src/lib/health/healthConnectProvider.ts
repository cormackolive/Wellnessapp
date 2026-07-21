// Live provider stub for Android Health Connect. Not wired up — Phase 3 per
// the product brief (Android release). `getHealthProvider()` in ./index.ts
// always returns the mock provider until this is implemented.
//
// To go live:
//   1. `npm install react-native-health-connect`, then `npx expo prebuild`.
//   2. Declare Health Connect permissions in the Android manifest.
//   3. Request read access to: steps, active energy, resting heart rate,
//      sleep session, exercise session, weight.

import type { HealthProvider } from './types';

export const healthConnectProvider: HealthProvider = {
  async isAvailable() {
    return false;
  },
  async requestPermissions() {
    throw new Error('Health Connect provider is not implemented yet. See comments in healthConnectProvider.ts.');
  },
  async getTodaySnapshot() {
    throw new Error('Health Connect provider is not implemented yet. See comments in healthConnectProvider.ts.');
  },
};
