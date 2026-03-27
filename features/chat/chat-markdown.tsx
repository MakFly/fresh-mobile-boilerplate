import Markdown from '@ronradtke/react-native-markdown-display';
import { StyleSheet } from 'react-native';

import { Fonts } from '@/constants/theme';
import { getChatPalette } from '@/features/chat/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function ChatMarkdown({ content }: { content: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);
  const styles = StyleSheet.create({
    body: {
      color: palette.text,
      fontFamily: Fonts.sans,
      fontSize: 16,
      lineHeight: 25,
    },
    text: {
      color: palette.text,
      fontFamily: Fonts.sans,
      fontSize: 16,
      lineHeight: 25,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
    },
    heading1: {
      color: palette.text,
      fontFamily: Fonts.rounded,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      marginTop: 8,
      marginBottom: 12,
    },
    heading2: {
      color: palette.text,
      fontFamily: Fonts.rounded,
      fontSize: 23,
      lineHeight: 30,
      fontWeight: '700',
      marginTop: 8,
      marginBottom: 10,
    },
    heading3: {
      color: palette.text,
      fontFamily: Fonts.rounded,
      fontSize: 19,
      lineHeight: 26,
      fontWeight: '700',
      marginTop: 8,
      marginBottom: 8,
    },
    bullet_list: {
      marginTop: 2,
      marginBottom: 12,
    },
    ordered_list: {
      marginTop: 2,
      marginBottom: 12,
    },
    list_item: {
      color: palette.text,
      marginBottom: 4,
    },
    strong: {
      fontWeight: '700',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: palette.accent,
      textDecorationLine: 'none',
    },
    blockquote: {
      backgroundColor: palette.quoteBackground,
      borderLeftColor: palette.quoteBorder,
      borderLeftWidth: 3,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 2,
      marginBottom: 12,
    },
    code_inline: {
      backgroundColor: palette.codeBackground,
      color: palette.text,
      borderRadius: 6,
      overflow: 'hidden',
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontFamily: Fonts.mono,
      fontSize: 14,
    },
    code_block: {
      backgroundColor: palette.codeBackground,
      color: palette.text,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontFamily: Fonts.mono,
      fontSize: 14,
      lineHeight: 22,
    },
    fence: {
      backgroundColor: palette.codeBackground,
      color: palette.text,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontFamily: Fonts.mono,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 12,
    },
    hr: {
      backgroundColor: palette.borderStrong,
      height: StyleSheet.hairlineWidth,
      marginVertical: 16,
    },
  });

  return <Markdown style={styles}>{content}</Markdown>;
}
