import { TextStyle } from 'react-native';

// Font families — loaded via expo-google-fonts in App.tsx
export const fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayRegular: 'PlayfairDisplay_400Regular',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const typography = {
  // Display / headings — Playfair Display
  h1: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.3,
  } as TextStyle,

  h2: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.2,
  } as TextStyle,

  h3: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0.1,
  } as TextStyle,

  h4: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
  } as TextStyle,

  // Body — Inter
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  } as TextStyle,

  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  } as TextStyle,

  bodyXSmall: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  } as TextStyle,

  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  labelSmall: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  } as TextStyle,

  // Buttons
  button: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.3,
  } as TextStyle,

  // Metric values
  metric: {
    fontFamily: fonts.bodyBold,
    fontSize: 28,
    lineHeight: 34,
  } as TextStyle,

  metricSmall: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    lineHeight: 26,
  } as TextStyle,
};