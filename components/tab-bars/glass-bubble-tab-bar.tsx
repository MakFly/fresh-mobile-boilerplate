import {
  BottomTabBarHeightCallbackContext,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { useNavigationChromeStore } from '@/core/store/navigation-chrome-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SPRING = { damping: 18, stiffness: 240, mass: 0.6 };
const ACTIVE_HEIGHT = 40;
const ACTIVE_HEIGHT_COMPACT = 34;

export function GlassBubbleTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const onTabBarHeight = React.useContext(BottomTabBarHeightCallbackContext);
  const homeTabCollapsed = useNavigationChromeStore((stateValue) => stateValue.homeTabCollapsed);
  const shouldCompact =
    Platform.OS === 'ios' && state.routes[state.index]?.name === 'index' && homeTabCollapsed;
  const chromeProgress = useSharedValue(shouldCompact ? 1 : 0);

  React.useEffect(() => {
    chromeProgress.value = withSpring(shouldCompact ? 1 : 0, SPRING);
  }, [chromeProgress, shouldCompact]);

  const reportHeight = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      if (height <= 0) return;
      onTabBarHeight?.(insets.bottom + 12 + height);
    },
    [insets.bottom, onTabBarHeight],
  );

  const capsuleStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(chromeProgress.value, [0, 1], [28, 24]),
    transform: [{ translateY: interpolate(chromeProgress.value, [0, 1], [0, 2]) }],
  }));

  const rowStyle = useAnimatedStyle(() => ({
    paddingHorizontal: interpolate(chromeProgress.value, [0, 1], [6, 8]),
    paddingVertical: interpolate(chromeProgress.value, [0, 1], [6, 4]),
  }));

  return (
    <View pointerEvents="box-none" style={styles.outer}>
      <View
        onLayout={reportHeight}
        style={[
          styles.capsuleWrap,
          {
            bottom: insets.bottom + 8,
          },
        ]}>
        <Animated.View
          style={[
            styles.capsule,
            capsuleStyle,
            {
              backgroundColor: isDark ? 'rgba(21, 29, 39, 0.82)' : 'rgba(248, 249, 251, 0.76)',
              borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.52)',
              shadowColor: palette.shadow,
            },
          ]}>
          {Platform.OS === 'ios' ? (
            <BlurView
              intensity={34}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null}

          <Animated.View style={[styles.row, rowStyle]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              return (
                <BubbleTabIcon
                  key={route.key}
                  isFocused={isFocused}
                  isDark={isDark}
                  icon={options.tabBarIcon}
                  chromeProgress={chromeProgress}
                  label={typeof options.title === 'string' ? options.title : route.name}
                  palette={palette}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarButtonTestID}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }

                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name, route.params);
                    }
                  }}
                  onLongPress={() => {
                    navigation.emit({ type: 'tabLongPress', target: route.key });
                  }}
                />
              );
            })}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

function BubbleTabIcon({
  isFocused,
  isDark,
  icon,
  chromeProgress,
  label,
  palette,
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
}: {
  isFocused: boolean;
  isDark: boolean;
  icon: BottomTabBarProps['descriptors'][string]['options']['tabBarIcon'];
  chromeProgress: SharedValue<number>;
  label: string;
  palette: (typeof Colors)['light'] | (typeof Colors)['dark'];
  accessibilityLabel?: string;
  testID?: string;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, SPRING);
  }, [isFocused, progress]);

  const bubbleStyle = useAnimatedStyle(() => ({
    minHeight: interpolate(chromeProgress.value, [0, 1], [ACTIVE_HEIGHT, ACTIVE_HEIGHT_COMPACT]),
    opacity: interpolate(progress.value, [0, 1], [0.76, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.98, 1]) }],
    borderColor: isDark
      ? `rgba(255,255,255,${interpolate(progress.value, [0, 1], [0, 0.12])})`
      : `rgba(255,255,255,${interpolate(progress.value, [0, 1], [0, 0.48])})`,
    backgroundColor: isDark
      ? `rgba(255,255,255,${interpolate(progress.value, [0, 1], [0, 0.08])})`
      : `rgba(255,255,255,${interpolate(progress.value, [0, 1], [0, 0.28])})`,
    paddingHorizontal: interpolate(chromeProgress.value, [0, 1], [12, 10]),
    gap: interpolate(chromeProgress.value, [0, 1], [6, 5]),
  }));

  const color = isFocused ? palette.tabIconSelected : palette.tabIconDefault;
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(chromeProgress.value, [0, 1], [1, 0.78]),
    transform: [{ translateY: interpolate(chromeProgress.value, [0, 1], [0, -0.5]) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.hitArea}>
      <Animated.View style={[styles.bubble, bubbleStyle]}>
        {icon?.({ focused: isFocused, color, size: 21 })}
        <Animated.View style={labelStyle}>
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              {
                color,
                fontFamily: Fonts.sans,
                fontWeight: isFocused ? '600' : '500',
              },
            ]}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  capsuleWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
  },
  capsule: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowOpacity: 0.16,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  hitArea: {
    flex: 1,
    minHeight: 44,
  },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
    flexShrink: 1,
    letterSpacing: -0.1,
  },
});
