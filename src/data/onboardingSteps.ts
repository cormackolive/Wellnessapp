import type { OnboardingStep, FieldOption } from './onboardingTypes';

const opts = (labels: string[]): FieldOption[] => labels.map((l) => ({ label: l, value: l }));

const WEIGHT_RELATED_GOALS = ['Lose weight gradually', 'Gain weight', 'Maintain my current weight'];

function touchesWeight(answers: { primaryGoal?: string; secondaryGoals: string[] }) {
  const all = [answers.primaryGoal, ...answers.secondaryGoals].filter(Boolean) as string[];
  return all.some((g) => WEIGHT_RELATED_GOALS.includes(g));
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // A. Account and identity
  {
    id: 'name',
    eyebrow: 'GETTING TO KNOW YOU',
    title: "What's your first name?",
    fields: [{ type: 'text', key: 'firstName', placeholder: 'First name' }],
  },
  {
    id: 'birth-date',
    eyebrow: 'GETTING TO KNOW YOU',
    title: 'When were you born?',
    subtitle: 'This helps Kin calculate personalized targets accurately.',
    fields: [{ type: 'text', key: 'birthDate', placeholder: 'MM/DD/YYYY' }],
  },
  {
    id: 'units',
    eyebrow: 'GETTING TO KNOW YOU',
    title: 'Which units do you prefer?',
    fields: [
      {
        type: 'single-select',
        key: 'preferredUnits',
        options: [
          { label: 'Imperial (lb, ft/in)', value: 'imperial' },
          { label: 'Metric (kg, cm)', value: 'metric' },
        ],
      },
    ],
  },
  {
    id: 'sex-at-birth',
    eyebrow: 'GETTING TO KNOW YOU',
    title: 'Sex assigned at birth',
    subtitle: 'Optional — improves the accuracy of your energy and macro targets.',
    optional: true,
    fields: [
      {
        type: 'single-select',
        key: 'sexAtBirth',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Intersex', value: 'intersex' },
          { label: 'Prefer not to say', value: 'prefer_not_to_say' },
        ],
      },
    ],
  },
  {
    id: 'gender-identity',
    eyebrow: 'GETTING TO KNOW YOU',
    title: 'How do you describe your gender?',
    subtitle: 'Optional, and kept separate from the calculation question above.',
    optional: true,
    fields: [{ type: 'text', key: 'genderIdentity', placeholder: 'Gender identity' }],
  },

  // B. Primary goals
  {
    id: 'goals-primary',
    eyebrow: 'YOUR INTENTION',
    title: 'What would you like Kin to help you with most?',
    subtitle: 'Choose the one that matters most right now.',
    fields: [
      {
        type: 'single-select',
        key: 'primaryGoal',
        options: opts([
          'Feel healthier day to day',
          'Lose weight gradually',
          'Gain weight',
          'Build muscle',
          'Improve energy',
          'Eat more balanced meals',
          'Increase protein',
          'Move more consistently',
          'Improve sleep',
          'Reduce stress',
          'Support athletic performance',
          'Build healthier routines',
          'Maintain my current weight',
          'Understand my habits',
        ]),
      },
    ],
  },
  {
    id: 'goals-secondary',
    eyebrow: 'YOUR INTENTION',
    title: 'Anything else feels important?',
    subtitle: 'Choose as many as apply.',
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'secondaryGoals',
        options: opts([
          'Feel healthier day to day',
          'Lose weight gradually',
          'Gain weight',
          'Build muscle',
          'Improve energy',
          'Eat more balanced meals',
          'Increase protein',
          'Move more consistently',
          'Improve sleep',
          'Reduce stress',
          'Support athletic performance',
          'Build healthier routines',
          'Understand my habits',
        ]),
      },
    ],
  },
  {
    id: 'guidance-level',
    eyebrow: 'YOUR INTENTION',
    title: 'How much guidance would you like?',
    fields: [
      {
        type: 'single-select',
        key: 'desiredGuidanceLevel',
        options: opts(['A lot of guidance', 'Some guidance', 'Mostly just the tools']),
      },
    ],
  },
  {
    id: 'pace',
    eyebrow: 'YOUR INTENTION',
    title: 'What pace of change feels right?',
    fields: [
      {
        type: 'single-select',
        key: 'desiredPace',
        options: opts(['Gradual', 'Steady', 'Ambitious']),
      },
    ],
  },

  // C. Weight-related branch
  {
    id: 'current-weight',
    eyebrow: 'YOUR STARTING POINT',
    title: "What's your current weight?",
    shouldShow: touchesWeight,
    fields: [{ type: 'number', key: 'currentWeightKg', placeholder: '68', suffix: 'kg' }],
  },
  {
    id: 'goal-weight',
    eyebrow: 'YOUR STARTING POINT',
    title: "What's your goal weight?",
    shouldShow: touchesWeight,
    fields: [{ type: 'number', key: 'goalWeightKg', placeholder: '64', suffix: 'kg' }],
  },
  {
    id: 'goal-timeline',
    eyebrow: 'YOUR STARTING POINT',
    title: "What's your desired timeline?",
    subtitle: "Kin will always keep this at a gradual, sustainable pace.",
    shouldShow: touchesWeight,
    fields: [{ type: 'number', key: 'goalTimelineWeeks', placeholder: '16', suffix: 'weeks' }],
  },
  {
    id: 'weight-display-prefs',
    eyebrow: 'YOUR STARTING POINT',
    title: 'What feels supportive to see?',
    shouldShow: touchesWeight,
    fields: [
      { type: 'yes-no', key: 'calorieGoalsFeelSupportive' },
      { type: 'yes-no', key: 'weightProjectionsFeelSupportive' },
    ],
  },

  // D. Body information
  {
    id: 'height',
    eyebrow: 'ABOUT YOUR BODY',
    title: "What's your height?",
    fields: [{ type: 'number', key: 'heightCm', placeholder: '165', suffix: 'cm' }],
  },
  {
    id: 'pregnancy-status',
    eyebrow: 'ABOUT YOUR BODY',
    title: 'Is any of this relevant to you right now?',
    optional: true,
    shouldShow: (a) => a.sexAtBirth === 'female',
    fields: [
      {
        type: 'single-select',
        key: 'pregnancyStatus',
        options: opts(['Not applicable', 'Pregnant', 'Postpartum', 'Trying to conceive', 'Prefer not to say']),
      },
    ],
  },

  // E. Activity
  {
    id: 'activity-level',
    eyebrow: 'HOW YOU MOVE',
    title: 'How would you describe your activity level?',
    fields: [
      {
        type: 'single-select',
        key: 'activityLevel',
        options: [
          { label: 'Sedentary — mostly sitting', value: 'sedentary' },
          { label: 'Lightly active', value: 'lightly_active' },
          { label: 'Moderately active', value: 'moderately_active' },
          { label: 'Highly active', value: 'highly_active' },
        ],
      },
    ],
  },
  {
    id: 'activity-detail',
    eyebrow: 'HOW YOU MOVE',
    title: 'A bit more about your routine',
    fields: [
      { type: 'number', key: 'daysExercisedPerWeek', label: 'Days exercised per week', placeholder: '3' },
      { type: 'number', key: 'typicalWorkoutMinutes', label: 'Typical workout length', placeholder: '45', suffix: 'min' },
    ],
  },

  // F. Workout preferences
  {
    id: 'favorite-workouts',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: 'What kinds of movement do you enjoy?',
    fields: [
      {
        type: 'multi-select',
        key: 'favoriteWorkouts',
        options: opts([
          'Walking', 'Running', 'Strength training', 'Pilates', 'Yoga', 'Spin', 'Dance', 'HIIT',
          'Swimming', 'Hiking', 'Team sports', 'Barre', 'Boxing', 'Cycling', 'At-home workouts',
          'Gym workouts', 'Outdoor workouts', 'Not sure yet',
        ]),
      },
    ],
  },
  {
    id: 'disliked-workouts',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: "Anything you'd rather avoid?",
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'dislikedWorkouts',
        options: opts([
          'Running', 'HIIT', 'Spin', 'Team sports', 'Swimming', 'Boxing', 'Early morning workouts', 'Gym crowds',
        ]),
      },
    ],
  },
  {
    id: 'workout-style',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: 'How do you like to move?',
    fields: [
      {
        type: 'single-select',
        key: 'classVsIndependent',
        options: opts(['Guided classes', 'Independent workouts', 'A mix of both']),
      },
      {
        type: 'single-select',
        key: 'indoorVsOutdoor',
        options: opts(['Indoor', 'Outdoor', 'No preference']),
      },
    ],
  },
  {
    id: 'workout-access',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: 'What do you have access to?',
    fields: [
      { type: 'yes-no', key: 'hasGymMembership' },
      {
        type: 'multi-select',
        key: 'equipmentAccess',
        options: opts(['Dumbbells', 'Resistance bands', 'Full home gym', 'Yoga mat', 'None of these']),
      },
    ],
  },
  {
    id: 'workout-limitations',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: 'Any injuries or movement limitations?',
    optional: true,
    fields: [{ type: 'text', key: 'injuriesOrLimitations', placeholder: 'e.g. left knee, lower back' }],
  },
  {
    id: 'workout-days',
    eyebrow: 'MOVEMENT YOU ENJOY',
    title: 'Which days usually work best?',
    fields: [
      {
        type: 'multi-select',
        key: 'preferredWorkoutDays',
        options: opts(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
      },
    ],
  },

  // G. Nutrition
  {
    id: 'diet-style',
    eyebrow: 'HOW YOU EAT',
    title: 'Do you follow a particular way of eating?',
    fields: [
      {
        type: 'single-select',
        key: 'dietStyle',
        options: opts([
          'No specific diet', 'Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free',
          'Halal', 'Kosher', 'Low-FODMAP', 'Other',
        ]),
      },
    ],
  },
  {
    id: 'allergies',
    eyebrow: 'HOW YOU EAT',
    title: 'Any allergies Kin should know about?',
    subtitle: 'Kin will exclude these from restaurant recommendations and flag them clearly. Restaurant preparation can still vary, so always confirm severe allergies directly.',
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'allergyList',
        options: opts(['Peanuts', 'Tree nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Fish', 'Sesame']),
      },
    ],
  },
  {
    id: 'foods-avoided',
    eyebrow: 'HOW YOU EAT',
    title: 'Any foods you avoid?',
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'foodsAvoided',
        options: opts(['Red meat', 'Pork', 'Shellfish', 'Alcohol', 'Added sugar', 'Ultra-processed foods']),
      },
    ],
  },
  {
    id: 'favorite-cuisines',
    eyebrow: 'HOW YOU EAT',
    title: 'What cuisines do you love?',
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'favoriteCuisines',
        options: opts([
          'Mediterranean', 'Mexican', 'Japanese', 'Thai', 'Italian', 'Indian', 'Middle Eastern',
          'American comfort', 'Korean', 'Vietnamese',
        ]),
      },
    ],
  },
  {
    id: 'meal-habits',
    eyebrow: 'HOW YOU EAT',
    title: 'Tell us about your typical rhythm',
    fields: [
      { type: 'number', key: 'mealFrequency', label: 'Meals per day', placeholder: '3' },
      {
        type: 'single-select',
        key: 'cookingFrequency',
        options: opts(['Rarely cook', 'A few times a week', 'Most days', 'Almost every meal']),
      },
      {
        type: 'single-select',
        key: 'takeoutFrequency',
        options: opts(['Rarely', 'Once a week', 'A few times a week', 'Most days']),
      },
    ],
  },
  {
    id: 'meal-budget',
    eyebrow: 'HOW YOU EAT',
    title: "What's a typical meal budget?",
    optional: true,
    fields: [{ type: 'number', key: 'typicalMealBudget', placeholder: '15', suffix: '$' }],
  },
  {
    id: 'nutrition-visibility',
    eyebrow: 'HOW YOU EAT',
    title: 'What feels supportive to track?',
    fields: [
      { type: 'yes-no', key: 'showNutritionNumbers' },
      { type: 'yes-no', key: 'trackCalories' },
      { type: 'yes-no', key: 'trackMacros' },
      { type: 'yes-no', key: 'proteinPriority' },
    ],
  },

  // H. Wellness concerns
  {
    id: 'wellness-concerns',
    eyebrow: 'WHAT YOU WANT SUPPORT WITH',
    title: 'What would you like support with?',
    fields: [
      {
        type: 'multi-select',
        key: 'wellnessConcerns',
        options: opts([
          'Energy', 'Sleep', 'Stress', 'Digestion', 'Hydration', 'Movement', 'Nutrition consistency',
          'Recovery', 'Focus', 'Mood', 'Menstrual-cycle awareness', 'General wellness',
        ]),
      },
    ],
  },

  // I. Sleep
  {
    id: 'sleep-basics',
    eyebrow: 'REST AND RECOVERY',
    title: 'How do you usually sleep?',
    fields: [
      { type: 'number', key: 'averageSleepHours', label: 'Average hours of sleep', placeholder: '7' },
      { type: 'number', key: 'sleepGoalHours', label: 'Sleep goal', placeholder: '8' },
    ],
  },
  {
    id: 'sleep-quality',
    eyebrow: 'REST AND RECOVERY',
    title: 'How restful has sleep felt lately?',
    fields: [
      {
        type: 'single-select',
        key: 'restfulness',
        options: opts(['Not restful', 'Somewhat restful', 'Restful', 'Very restful']),
      },
      {
        type: 'single-select',
        key: 'sleepConsistency',
        options: opts(['Very inconsistent', 'Somewhat consistent', 'Consistent']),
      },
    ],
  },

  // J. Mood and stress
  {
    id: 'stress-level',
    eyebrow: 'MOOD AND STRESS',
    title: 'How would you rate your typical stress level?',
    fields: [{ type: 'pills-scale', key: 'typicalStressLevel', min: 1, max: 5, labels: ['Very low', 'Low', 'Moderate', 'High', 'Very high'] }],
  },
  {
    id: 'calming-activities',
    eyebrow: 'MOOD AND STRESS',
    title: 'What helps you feel calmer?',
    optional: true,
    fields: [
      {
        type: 'multi-select',
        key: 'favoriteCalmingActivities',
        options: opts(['Breathing exercises', 'Walking', 'Journaling', 'Music', 'Stretching', 'Time outside', 'Talking to someone']),
      },
    ],
  },
  {
    id: 'checkin-frequency',
    eyebrow: 'MOOD AND STRESS',
    title: 'How often would you like to check in?',
    fields: [
      {
        type: 'single-select',
        key: 'checkInFrequency',
        options: opts(['A few times a day', 'Once a day', 'A few times a week', 'Rarely']),
      },
    ],
  },

  // K. Hydration
  {
    id: 'hydration',
    eyebrow: 'HYDRATION',
    title: 'How much water do you usually drink?',
    fields: [
      { type: 'number', key: 'typicalWaterIntakeMl', placeholder: '1500', suffix: 'ml' },
      { type: 'yes-no', key: 'trackCaffeine' },
    ],
  },

  // L. Supplements
  {
    id: 'supplements-interest',
    eyebrow: 'SUPPLEMENTS',
    title: 'Want reminders for supplements?',
    subtitle: "You can add specific supplements anytime from your profile.",
    fields: [{ type: 'yes-no', key: 'wantsSupplementReminders' }],
  },

  // M. Schedule and lifestyle
  {
    id: 'lifestyle',
    eyebrow: 'YOUR SCHEDULE',
    title: 'Which best describes your days?',
    fields: [
      {
        type: 'single-select',
        key: 'lifestyleType',
        options: opts(['Student', 'Employed', 'Both', 'Other']),
      },
    ],
  },
  {
    id: 'kitchen-travel',
    eyebrow: 'YOUR SCHEDULE',
    title: 'A little more about your day-to-day',
    fields: [
      { type: 'yes-no', key: 'kitchenAccess' },
      {
        type: 'single-select',
        key: 'travelFrequency',
        options: opts(['Rarely travel', 'Occasionally', 'Frequently']),
      },
    ],
  },

  // N + O handled by dedicated screens: connected-apps.tsx, permissions.tsx
];

export function getVisibleSteps(answers: Parameters<NonNullable<OnboardingStep['shouldShow']>>[0]) {
  return ONBOARDING_STEPS.filter((step) => !step.shouldShow || step.shouldShow(answers));
}

export function getStepIndex(stepId: string, answers: Parameters<NonNullable<OnboardingStep['shouldShow']>>[0]) {
  return getVisibleSteps(answers).findIndex((s) => s.id === stepId);
}

export function getNextStepId(currentId: string, answers: Parameters<NonNullable<OnboardingStep['shouldShow']>>[0]): string | null {
  const visible = getVisibleSteps(answers);
  const index = visible.findIndex((s) => s.id === currentId);
  if (index === -1 || index === visible.length - 1) return null;
  return visible[index + 1].id;
}

export function getPreviousStepId(currentId: string, answers: Parameters<NonNullable<OnboardingStep['shouldShow']>>[0]): string | null {
  const visible = getVisibleSteps(answers);
  const index = visible.findIndex((s) => s.id === currentId);
  if (index <= 0) return null;
  return visible[index - 1].id;
}
