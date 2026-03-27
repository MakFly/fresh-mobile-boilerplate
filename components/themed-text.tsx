import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'hero' | 'defaultSemiBold' | 'subtitle' | 'caption' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'hero' ? styles.hero : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    fontFamily: Fonts.rounded,
  },
  hero: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '700',
    letterSpacing: -1.6,
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  link: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});
