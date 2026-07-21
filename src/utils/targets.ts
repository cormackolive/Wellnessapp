export type SexAtBirth = 'female' | 'male' | 'intersex' | 'prefer_not_to_say';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'highly_active';
export type GoalDirection = 'lose' | 'maintain' | 'gain';

export type TargetInput = {
  sexAtBirth: SexAtBirth;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalDirection: GoalDirection;
  goalWeightKg?: number;
  goalTimelineWeeks?: number;
};

export type EnergyTargetResult = {
  bmr: number;
  tdee: number;
  energyMin: number;
  energyMax: number;
  appliedTimelineWeeks?: number;
  safetyAdjusted: boolean;
  safetyMessage?: string;
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  highly_active: 1.725,
};

// Safe, sustainable bounds — never let a requested timeline push past these.
const MAX_WEEKLY_LOSS_KG = 0.9; // ~2 lb/week upper bound for "gradual"
const MAX_WEEKLY_GAIN_KG = 0.45; // ~1 lb/week upper bound for lean gain
const KCAL_PER_KG = 7700;
const MIN_SAFE_KCAL: Record<SexAtBirth, number> = {
  female: 1400,
  male: 1600,
  intersex: 1400,
  prefer_not_to_say: 1400,
};

export function calculateBMR({ sexAtBirth, ageYears, heightCm, weightKg }: TargetInput): number {
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  if (sexAtBirth === 'male') return Math.round(base + 5);
  if (sexAtBirth === 'female') return Math.round(base - 161);
  return Math.round(base - 78); // midpoint estimate for intersex / prefer not to say
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Computes a safe daily energy range. If the user's requested timeline would
 * require an unsafe deficit/surplus, the pace is silently capped to the
 * nearest safe rate and `safetyAdjusted` is set so the UI can explain why.
 */
export function calculateEnergyTarget(input: TargetInput): EnergyTargetResult {
  const bmr = calculateBMR(input);
  const tdee = calculateTDEE(bmr, input.activityLevel);
  const floor = MIN_SAFE_KCAL[input.sexAtBirth];

  if (input.goalDirection === 'maintain') {
    return {
      bmr,
      tdee,
      energyMin: Math.max(floor, tdee - 75),
      energyMax: tdee + 75,
      safetyAdjusted: false,
    };
  }

  let weeklyRateKg =
    input.goalDirection === 'lose' ? MAX_WEEKLY_LOSS_KG : MAX_WEEKLY_GAIN_KG;
  let safetyAdjusted = false;
  let safetyMessage: string | undefined;

  if (input.goalWeightKg !== undefined && input.goalTimelineWeeks && input.goalTimelineWeeks > 0) {
    const totalDeltaKg = Math.abs(input.goalWeightKg - input.weightKg);
    const requestedWeeklyRate = totalDeltaKg / input.goalTimelineWeeks;
    const cap = input.goalDirection === 'lose' ? MAX_WEEKLY_LOSS_KG : MAX_WEEKLY_GAIN_KG;

    if (requestedWeeklyRate > cap) {
      weeklyRateKg = cap;
      safetyAdjusted = true;
      safetyMessage =
        'Kin supports gradual, sustainable changes, so your plan uses a safer pace than your original timeline. Consider talking with a healthcare provider if you want to move faster.';
    } else {
      weeklyRateKg = requestedWeeklyRate;
    }
  }

  const dailyDeltaKcal = (weeklyRateKg * KCAL_PER_KG) / 7;
  const signedDelta = input.goalDirection === 'lose' ? -dailyDeltaKcal : dailyDeltaKcal;
  const center = Math.round(tdee + signedDelta);
  const centerFloored = Math.max(floor, center);

  if (centerFloored !== center) {
    safetyAdjusted = true;
    safetyMessage =
      "Kin never sets a target below a safe minimum. Your range has been adjusted — consider talking with a healthcare provider for individualized guidance.";
  }

  return {
    bmr,
    tdee,
    energyMin: centerFloored - 100,
    energyMax: centerFloored + 100,
    appliedTimelineWeeks: weeklyRateKg > 0 && input.goalWeightKg !== undefined
      ? Math.round(Math.abs(input.goalWeightKg - input.weightKg) / weeklyRateKg)
      : undefined,
    safetyAdjusted,
    safetyMessage,
  };
}

export type MacroRanges = {
  proteinGMin: number;
  proteinGMax: number;
  carbsGMin: number;
  carbsGMax: number;
  fatGMin: number;
  fatGMax: number;
  fiberG: number;
};

/**
 * Protein is weight-anchored (supports muscle/satiety regardless of goal),
 * fat gets a fixed floor for hormonal health, and carbs fill the remainder.
 */
export function calculateMacroRanges(energyMax: number, weightKg: number, proteinPriority: boolean): MacroRanges {
  const proteinPerKg = proteinPriority ? 1.8 : 1.4;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round((energyMax * 0.28) / 9);
  const remainingKcal = Math.max(0, energyMax - proteinG * 4 - fatG * 9);
  const carbsG = Math.round(remainingKcal / 4);

  return {
    proteinGMin: Math.max(0, proteinG - 10),
    proteinGMax: proteinG + 10,
    carbsGMin: Math.max(0, carbsG - 20),
    carbsGMax: carbsG + 20,
    fatGMin: Math.max(0, fatG - 8),
    fatGMax: fatG + 8,
    fiberG: 28,
  };
}

export function calculateWaterTargetMl(weightKg: number, activityLevel: ActivityLevel): number {
  const base = weightKg * 33; // ~33ml per kg body weight, a common clinical rule of thumb
  const activityBonus = { sedentary: 0, lightly_active: 200, moderately_active: 400, highly_active: 600 }[activityLevel];
  return Math.round((base + activityBonus) / 50) * 50;
}
