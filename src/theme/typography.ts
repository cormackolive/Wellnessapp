export const fonts = {
  display: 'BodoniModa_400Regular',
  displayItalic: 'BodoniModa_400Regular_Italic',
  displayMedium: 'BodoniModa_500Medium',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemiBold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

export const type = {
  displayXl: { fontFamily: fonts.display, fontSize: 48, lineHeight: 52, letterSpacing: -1.2 },
  displayL: { fontFamily: fonts.display, fontSize: 38, lineHeight: 42, letterSpacing: -0.8 },
  h1: { fontFamily: fonts.display, fontSize: 32, lineHeight: 37 },
  h2: { fontFamily: fonts.display, fontSize: 26, lineHeight: 31 },
  h3: { fontFamily: fonts.bodyMedium, fontSize: 20, lineHeight: 26 },
  bodyLarge: { fontFamily: fonts.body, fontSize: 17, lineHeight: 25 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15, letterSpacing: 0.3 },
  eyebrow: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20 },
} as const;
