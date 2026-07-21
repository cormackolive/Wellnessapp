export const colors = {
  ink: '#20221E',
  moss: '#33402F',
  forest: '#43503A',
  sage: '#929A7E',
  celadon: '#DCE8D8',
  ivory: '#F5F1E9',
  oat: '#E9E3D8',
  stone: '#D6D2C9',
  mistBlue: '#BBC6C7',
  powderBlue: '#DCE4E8',
  blush: '#D7C1BC',
  lilac: '#D9CCD9',
  butter: '#E8D66D',
  orchid: '#C78FB7',
  white: '#FFFFFF',

  success: '#66805C',
  warning: '#B28A45',
  error: '#A65F59',
  info: '#71898E',
} as const;

export const darkColors = {
  ink: '#F5F1E9',
  moss: '#DCE8D8',
  forest: '#B9C7AE',
  sage: '#929A7E',
  celadon: '#2A3327',
  ivory: '#1C1E19',
  oat: '#262924',
  stone: '#3A3D36',
  mistBlue: '#4B5758',
  powderBlue: '#33403F',
  blush: '#4A3634',
  lilac: '#3A323A',
  butter: '#E8D66D',
  orchid: '#C78FB7',
  white: '#20221E',

  success: '#8FAF83',
  warning: '#D4A868',
  error: '#C57D76',
  info: '#8FAEB3',
} as const;

export const gradients = {
  primary: ['#EFF5EA', '#DCE8D8', '#6F9C68'] as const,
  botanicalBlur: [
    'rgba(78, 114, 67, 0.72)',
    'rgba(127, 158, 113, 0.35)',
    'rgba(239, 245, 234, 0.08)',
  ] as const,
  orchidAccent: ['#E1C7DE', '#C789B6', '#A54E91'] as const,
};

export const moodColors = ['#A65F59', '#D7C1BC', '#E8D66D', '#929A7E', '#33402F'];

export type ColorToken = keyof typeof colors;
