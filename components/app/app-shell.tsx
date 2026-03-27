import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { PropsWithChildren, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppShellProps = PropsWithChildren<{
  scroll?: boolean;
  keyboard?: boolean;
  contentStyle?: ViewStyle;
  safeAreaEdges?: Edge[];
  bottomInsetMode?: 'none' | 'tabBar';
  topInset?: number;
}>;

export function AppShell({
  children,
  scroll = false,
  keyboard = false,
  contentStyle,
  safeAreaEdges = ['left', 'right'],
  bottomInsetMode = 'tabBar',
  topInset = 8,
}: AppShellProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const tabBarNavHeight = useContext(BottomTabBarHeightContext);
  const bottomPadding =
    bottomInsetMode === 'tabBar' && typeof tabBarNavHeight === 'number'
      ? tabBarNavHeight + 28
      : Math.max(24, insets.bottom + 12);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: topInset, paddingBottom: bottomPadding }, contentStyle]}
      style={[styles.container, { backgroundColor: palette.canvas }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        styles.container,
        { backgroundColor: palette.canvas, paddingTop: topInset, paddingBottom: bottomPadding },
        contentStyle,
      ]}>
      {children}
    </View>
  );

  if (!keyboard) {
    return (
      <SafeAreaView
        edges={safeAreaEdges}
        style={[styles.safeArea, { backgroundColor: palette.canvas }]}>
        {body}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles.safeArea, { backgroundColor: palette.canvas }]}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 18,
  },
});
