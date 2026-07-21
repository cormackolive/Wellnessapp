export type HealthSnapshot = {
  steps?: number;
  activeEnergyKcal?: number;
  restingHeartRate?: number;
  sleepDurationMinutes?: number;
  sleepStart?: string;
  sleepEnd?: string;
  readinessScore?: number;
  mindfulMinutes?: number;
  weightKg?: number;
  source: 'apple_health' | 'oura' | 'whoop' | 'garmin' | 'fitbit' | 'health_connect' | 'mock';
  fetchedAt: string;
};

export interface HealthProvider {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySnapshot(): Promise<HealthSnapshot>;
}
