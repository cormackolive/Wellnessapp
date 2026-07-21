import type { HealthProvider, HealthSnapshot } from './types';

export const mockHealthProvider: HealthProvider = {
  async isAvailable() {
    return true;
  },
  async requestPermissions() {
    return true;
  },
  async getTodaySnapshot(): Promise<HealthSnapshot> {
    const now = new Date();
    const sleepEnd = new Date(now);
    sleepEnd.setHours(6, 45, 0, 0);
    const sleepStart = new Date(sleepEnd);
    sleepStart.setHours(sleepStart.getHours() - 6, sleepStart.getMinutes() - 14);

    return {
      steps: 8420,
      activeEnergyKcal: 410,
      restingHeartRate: 61,
      sleepDurationMinutes: 374,
      sleepStart: sleepStart.toISOString(),
      sleepEnd: sleepEnd.toISOString(),
      readinessScore: 68,
      mindfulMinutes: 3,
      weightKg: undefined,
      source: 'mock',
      fetchedAt: now.toISOString(),
    };
  },
};
