import { calculateBMR, calculateEnergyTarget, calculateMacroRanges, calculateTDEE, calculateWaterTargetMl } from '../targets';

describe('calculateBMR', () => {
  it('computes Mifflin-St Jeor for a male', () => {
    const bmr = calculateBMR({
      sexAtBirth: 'male',
      ageYears: 30,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderately_active',
      goalDirection: 'maintain',
    });
    expect(bmr).toBe(Math.round(10 * 80 + 6.25 * 180 - 5 * 30 + 5));
  });

  it('computes Mifflin-St Jeor for a female', () => {
    const bmr = calculateBMR({
      sexAtBirth: 'female',
      ageYears: 28,
      heightCm: 165,
      weightKg: 62,
      activityLevel: 'lightly_active',
      goalDirection: 'maintain',
    });
    expect(bmr).toBe(Math.round(10 * 62 + 6.25 * 165 - 5 * 28 - 161));
  });
});

describe('calculateTDEE', () => {
  it('applies the sedentary multiplier', () => {
    expect(calculateTDEE(1500, 'sedentary')).toBe(1800);
  });

  it('applies the highly active multiplier', () => {
    expect(calculateTDEE(1500, 'highly_active')).toBe(Math.round(1500 * 1.725));
  });
});

describe('calculateEnergyTarget', () => {
  const base = {
    sexAtBirth: 'female' as const,
    ageYears: 26,
    heightCm: 165,
    weightKg: 68,
    activityLevel: 'moderately_active' as const,
  };

  it('returns a tight maintenance range around TDEE', () => {
    const result = calculateEnergyTarget({ ...base, goalDirection: 'maintain' });
    expect(result.energyMax - result.energyMin).toBe(150);
    expect(result.safetyAdjusted).toBe(false);
  });

  it('caps an unsafe weight-loss timeline to a safer pace', () => {
    // Requesting to lose 10kg in 4 weeks (2.5kg/week) is far beyond the safe cap.
    const result = calculateEnergyTarget({
      ...base,
      goalDirection: 'lose',
      goalWeightKg: base.weightKg - 10,
      goalTimelineWeeks: 4,
    });

    expect(result.safetyAdjusted).toBe(true);
    expect(result.safetyMessage).toBeDefined();
    // A safely-capped target should never crash through the minimum safe floor.
    expect(result.energyMin).toBeGreaterThanOrEqual(1300);
  });

  it('never sets a target below the safe floor for the stated sex', () => {
    const result = calculateEnergyTarget({
      sexAtBirth: 'female',
      ageYears: 22,
      heightCm: 150,
      weightKg: 45,
      activityLevel: 'sedentary',
      goalDirection: 'lose',
      goalWeightKg: 40,
      goalTimelineWeeks: 8,
    });
    expect(result.energyMin).toBeGreaterThanOrEqual(1300);
  });

  it('does not adjust a reasonable, already-safe timeline', () => {
    const result = calculateEnergyTarget({
      ...base,
      goalDirection: 'lose',
      goalWeightKg: base.weightKg - 4,
      goalTimelineWeeks: 16, // 0.25kg/week, well under the cap
    });
    expect(result.safetyAdjusted).toBe(false);
  });
});

describe('calculateMacroRanges', () => {
  it('prioritizes protein when protein priority is enabled', () => {
    const withPriority = calculateMacroRanges(2000, 70, true);
    const withoutPriority = calculateMacroRanges(2000, 70, false);
    expect(withPriority.proteinGMax).toBeGreaterThan(withoutPriority.proteinGMax);
  });

  it('never returns negative macro values', () => {
    const result = calculateMacroRanges(1200, 50, false);
    expect(result.carbsGMin).toBeGreaterThanOrEqual(0);
    expect(result.fatGMin).toBeGreaterThanOrEqual(0);
    expect(result.proteinGMin).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateWaterTargetMl', () => {
  it('increases with activity level', () => {
    const sedentary = calculateWaterTargetMl(70, 'sedentary');
    const active = calculateWaterTargetMl(70, 'highly_active');
    expect(active).toBeGreaterThan(sedentary);
  });
});
