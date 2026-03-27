import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  height?: number;
  width?: number | `${number}%`;
  radius?: number;
};

export function Skeleton({ style, height = 14, width = '100%', radius = 8 }: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.85, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          height,
          width,
          borderRadius: radius,
          backgroundColor: palette.borderStrong,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}
