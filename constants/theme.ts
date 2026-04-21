import { Platform } from 'react-native';

// Ocean palette — deep navy to pale cyan.
// Source: ['#03045e','#023e8a','#0077b6','#0096c7','#00b4d8','#48cae4','#90e0ef','#ade8f4','#caf0f8']
export const Palette = {
  navy: '#03045e',
  deepBlue: '#023e8a',
  blue: '#0077b6',
  blueMid: '#0096c7',
  cyan: '#00b4d8',
  cyanMid: '#48cae4',
  cyanLight: '#90e0ef',
  cyanPale: '#ade8f4',
  cyanMist: '#caf0f8',
};

export const Colors = {
  // Primary — confident mid-ocean blue
  primary: Palette.blue,
  primaryDark: Palette.deepBlue,
  primaryLight: Palette.blueMid,

  // Accent — bright cyan pop for highlights
  accent: Palette.cyan,
  accentLight: Palette.cyanMid,
  accentTint: Palette.cyanMist,

  // Backgrounds
  background: '#F2FAFD',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceAlt: '#EAF6FB',

  // Text — deep navy for strong, modern contrast
  text: Palette.navy,
  textSecondary: '#334E7B',
  textMuted: '#7A94B8',
  textOnPrimary: '#FFFFFF',

  // Accents / semantic
  error: '#E63946',
  errorLight: '#FEF2F2',
  success: '#06D6A0',
  successLight: '#E6FBF5',
  warning: '#FFB703',

  // Borders & dividers
  border: '#D6E8EF',
  borderLight: '#EAF4F8',

  // Overlays
  overlay: 'rgba(3, 4, 94, 0.55)',
  shadow: Palette.navy,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

// Modern sans-serif stack: SF Pro on iOS, Roboto on Android.
// Both are tight, geometric, and pair well with a cool-blue palette.
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const fontFamilyMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const Fonts = {
  regular: fontFamily,
  medium: fontFamilyMedium,
};

export const Typography = {
  h1: {
    fontFamily: fontFamilyMedium,
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fontFamilyMedium,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamilyMedium,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: fontFamilyMedium,
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
};
