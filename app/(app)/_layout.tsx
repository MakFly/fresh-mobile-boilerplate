import { Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';

import {
  areAuthReturnToEqual,
  getAuthReturnToFromSegments,
  isAuthRequiredAuthReturnTo,
} from '@/core/auth/return-to';
import { Colors, Fonts } from '@/constants/theme';
import { useAppStore } from '@/core/store/app-store';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const segments = useSegments();
  const user = useCurrentUser();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const setLastAuthReturnTo = useAppStore((state) => state.setLastAuthReturnTo);
  const currentAuthReturnTo = getAuthReturnToFromSegments(segments);

  useEffect(() => {
    if (
      areAuthReturnToEqual(lastAuthReturnTo, currentAuthReturnTo) ||
      (!user && isAuthRequiredAuthReturnTo(currentAuthReturnTo))
    ) {
      return;
    }

    setLastAuthReturnTo(currentAuthReturnTo);
  }, [currentAuthReturnTo, lastAuthReturnTo, setLastAuthReturnTo, user]);

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.canvas },
        headerTintColor: palette.text,
        contentStyle: { backgroundColor: palette.canvas },
        headerTitleStyle: {
          fontFamily: Fonts.sans,
          fontWeight: '600',
          fontSize: 16,
        },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
