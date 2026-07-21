import { mockHealthProvider } from './mockProvider';
import type { HealthProvider } from './types';

export * from './types';

// HealthKit/Health Connect adapters are documented (healthKitProvider.ts,
// healthConnectProvider.ts) but require native modules + a prebuild, so the
// mock provider is always used until those are wired up.
export const healthProvider: HealthProvider = mockHealthProvider;
