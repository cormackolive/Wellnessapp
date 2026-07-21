export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  card: 20,
  sm: 12,
  pill: 999,
} as const;

export const sizes = {
  screenPaddingX: 20,
  editorialPaddingX: 24,
  buttonPrimaryHeight: 54,
  buttonSecondaryHeight: 48,
  inputHeight: 54,
} as const;

export const shadows = {
  standard: {
    shadowColor: '#20221E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#20221E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.11,
    shadowRadius: 50,
    elevation: 8,
  },
} as const;

export const motion = {
  quick: 200,
  standard: 320,
  editorial: 550,
} as const;
