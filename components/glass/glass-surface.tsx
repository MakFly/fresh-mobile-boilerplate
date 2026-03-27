import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type GlassSurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: 'default' | 'hero';
}>;

export function GlassSurface({
  children,
  style,
  contentStyle,
  variant = 'default',
}: GlassSurfaceProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: variant === 'hero' ? palette.cardStrong : palette.card,
          borderColor: palette.borderStrong,
          shadowColor: palette.shadow,
        },
        style,
      ]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={variant === 'hero' ? 46 : 28}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)']
            : ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.18)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.55, y: 0.4 }}
        style={styles.specular}
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 5,
  },
  content: {
    gap: 12,
    padding: 18,
  },
  specular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 84,
  },
});
