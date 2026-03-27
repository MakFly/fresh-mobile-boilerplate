import '@/global.css';
import '@/core/notifications/handler';

import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppErrorBoundary } from '@/components/app/error-boundary';
import { Colors, NavigationPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProviders } from '@/providers/app-providers';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayout() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: colorScheme === 'dark' ? NavigationPalette.dark : NavigationPalette.light,
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  return (
    <AppErrorBoundary>
      <AppProviders>
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: palette.background } }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(public)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="samples" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <PortalHost />
        </ThemeProvider>
      </AppProviders>
    </AppErrorBoundary>
  );
}

export default RootLayout;
