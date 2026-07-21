import type { OnboardingAnswers } from '@/store/onboardingStore';

export type FieldOption = { label: string; value: string };

export type OnboardingField =
  | { type: 'text'; key: keyof OnboardingAnswers; label?: string; placeholder?: string; keyboardType?: 'default' | 'numeric' }
  | { type: 'number'; key: keyof OnboardingAnswers; label?: string; placeholder?: string; suffix?: string }
  | { type: 'single-select'; key: keyof OnboardingAnswers; label?: string; options: FieldOption[] }
  | { type: 'multi-select'; key: keyof OnboardingAnswers; label?: string; options: FieldOption[] }
  | { type: 'pills-scale'; key: keyof OnboardingAnswers; label?: string; min: number; max: number; labels?: string[] }
  | { type: 'yes-no'; key: keyof OnboardingAnswers; label?: string };

export type OnboardingStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  fields: OnboardingField[];
  optional?: boolean;
  shouldShow?: (answers: OnboardingAnswers) => boolean;
};
