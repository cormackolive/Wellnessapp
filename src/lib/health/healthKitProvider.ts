// Live provider stub for Apple HealthKit (iOS only). Not wired up —
// `getHealthProvider()` in ./index.ts always returns the mock provider until
// this is implemented, since HealthKit access requires a native module.
//
// To go live:
//   1. `npm install expo-health` or `react-native-health`, then
//      `npx expo prebuild` (native module, not available in Expo Go).
//   2. Info.plist usage strings are already set in app.json
//      (NSHealthShareUsageDescription / NSHealthUpdateUsageDescription).
//   3. Request read access to: steps, active energy, resting heart rate,
//      sleep analysis, mindful minutes, body mass.
//   4. Map HealthKit's sample-based API into a single HealthSnapshot per day.

import type { HealthProvider } from './types';

export const healthKitProvider: HealthProvider = {
  async isAvailable() {
    return false;
  },
  async requestPermissions() {
    throw new Error('HealthKit provider is not implemented yet. See comments in healthKitProvider.ts.');
  },
  async getTodaySnapshot() {
    throw new Error('HealthKit provider is not implemented yet. See comments in healthKitProvider.ts.');
  },
};
