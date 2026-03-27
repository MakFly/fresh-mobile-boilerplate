export type ChatPalette = {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceStrong: string;
  headerBackground: string;
  separator: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  accentForeground: string;
  iconSurface: string;
  iconSurfaceStrong: string;
  listPressed: string;
  suggestionBackground: string;
  suggestionBorder: string;
  userBubble: string;
  userBubbleText: string;
  codeBackground: string;
  quoteBackground: string;
  quoteBorder: string;
  emptyIconBackground: string;
};

const CHAT_PALETTES: Record<'light' | 'dark', ChatPalette> = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceMuted: '#F7F7F8',
    surfaceStrong: '#F1F1F2',
    headerBackground: '#FFFFFF',
    separator: 'rgba(0, 0, 0, 0.06)',
    border: 'rgba(0, 0, 0, 0.08)',
    borderStrong: 'rgba(0, 0, 0, 0.14)',
    text: '#1F1F1F',
    textMuted: '#636363',
    textSoft: '#8A8A8A',
    accent: '#10A37F',
    accentForeground: '#FFFFFF',
    iconSurface: '#F2F2F2',
    iconSurfaceStrong: '#ECECEC',
    listPressed: 'rgba(0, 0, 0, 0.04)',
    suggestionBackground: '#F7F7F8',
    suggestionBorder: 'rgba(0, 0, 0, 0.06)',
    userBubble: '#F0F0F0',
    userBubbleText: '#1F1F1F',
    codeBackground: '#F4F4F4',
    quoteBackground: '#FAFAFA',
    quoteBorder: '#D7D7D7',
    emptyIconBackground: 'rgba(16, 163, 127, 0.12)',
  },
  dark: {
    background: '#212121',
    surface: '#2F2F2F',
    surfaceMuted: '#171717',
    surfaceStrong: '#2A2A2A',
    headerBackground: '#212121',
    separator: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    text: '#ECECEC',
    textMuted: '#B4B4B4',
    textSoft: '#8E8E8E',
    accent: '#10A37F',
    accentForeground: '#FFFFFF',
    iconSurface: '#2D2D2D',
    iconSurfaceStrong: '#3A3A3A',
    listPressed: 'rgba(255, 255, 255, 0.06)',
    suggestionBackground: '#2A2A2A',
    suggestionBorder: 'rgba(255, 255, 255, 0.08)',
    userBubble: '#303030',
    userBubbleText: '#ECECEC',
    codeBackground: '#171717',
    quoteBackground: '#262626',
    quoteBorder: '#4A4A4A',
    emptyIconBackground: 'rgba(16, 163, 127, 0.16)',
  },
};

export function getChatPalette(colorScheme: 'light' | 'dark') {
  return CHAT_PALETTES[colorScheme];
}
