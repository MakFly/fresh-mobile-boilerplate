import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function GlassTabBarBackground({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const palette = Colors[colorScheme];

  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
      ]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={16}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
