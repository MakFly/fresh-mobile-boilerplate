import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type HapticTabProps = BottomTabBarButtonProps & {
  activeBackgroundColor?: string;
  activeBorderColor?: string;
  children?: ReactNode;
};

export function HapticTab({
  activeBackgroundColor,
  activeBorderColor,
  children,
  style,
  ...props
}: HapticTabProps) {
  const selected = Boolean(props.accessibilityState?.selected);

  return (
    <PlatformPressable
      {...props}
      style={style}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}>
      <View
        style={[
          styles.inner,
          selected
            ? {
                backgroundColor: activeBackgroundColor,
                borderColor: activeBorderColor,
                shadowOpacity: 0.08,
              }
            : styles.idle,
        ]}>
        {children}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  inner: {
    minWidth: 74,
    minHeight: 32,
    alignSelf: 'center',
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  idle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});
