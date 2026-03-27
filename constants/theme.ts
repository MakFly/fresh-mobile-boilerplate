import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#142131',
    textMuted: '#5A6878',
    textSoft: '#7D8A99',
    background: '#FFFFFF',
    canvas: '#F5F6F8',
    tint: '#0F62FE',
    accent: '#9FE7DB',
    icon: '#667485',
    tabIconDefault: '#728092',
    tabIconSelected: '#0E1A29',
    border: 'rgba(20, 33, 49, 0.06)',
    borderStrong: 'rgba(20, 33, 49, 0.12)',
    card: 'rgba(255, 255, 255, 0.92)',
    cardStrong: 'rgba(255, 255, 255, 0.98)',
    overlay: 'rgba(15, 23, 42, 0.035)',
    shadow: 'rgba(15, 23, 42, 0.06)',
    success: '#1A9A72',
  },
  dark: {
    text: '#F3F8FB',
    textMuted: '#A7B5C4',
    textSoft: '#7F8D9C',
    background: '#0B1117',
    canvas: '#121A23',
    tint: '#A7CBFF',
    accent: '#72D4C8',
    icon: '#8EA0B4',
    tabIconDefault: '#8496A8',
    tabIconSelected: '#F6FAFC',
    border: 'rgba(255, 255, 255, 0.06)',
    borderStrong: 'rgba(255, 255, 255, 0.12)',
    card: 'rgba(18, 27, 36, 0.82)',
    cardStrong: 'rgba(18, 27, 36, 0.94)',
    overlay: 'rgba(255, 255, 255, 0.06)',
    shadow: 'rgba(0, 0, 0, 0.34)',
    success: '#55D0A0',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const NavigationPalette = {
  light: {
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: 'rgba(255, 255, 255, 0.8)',
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
  dark: {
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: 'rgba(18, 29, 40, 0.92)',
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
};
