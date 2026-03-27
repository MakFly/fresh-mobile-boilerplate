import { Redirect, Stack, useGlobalSearchParams, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { StateScreen } from '@/components/app/state-screen';
import { Colors } from '@/constants/theme';
import {
  areAuthReturnToEqual,
  getAuthReturnToFromSegments,
  serializeAuthReturnTo,
} from '@/core/auth/return-to';
import { useFeatureFlag } from '@/core/feature-flags';
import { useAppStore } from '@/core/store/app-store';
import { useAuthSession } from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SamplesLayout() {
  const samplesEnabled = useFeatureFlag('samplesStack');
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { data: session, isLoading } = useAuthSession();
  const segments = useSegments();
  const params = useGlobalSearchParams<{ threadId?: string | string[] }>();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const setLastAuthReturnTo = useAppStore((state) => state.setLastAuthReturnTo);
  const currentAuthReturnTo = getAuthReturnToFromSegments(segments, params);

  useEffect(() => {
    if (!session || areAuthReturnToEqual(lastAuthReturnTo, currentAuthReturnTo)) return;
    setLastAuthReturnTo(currentAuthReturnTo);
  }, [currentAuthReturnTo, lastAuthReturnTo, session, setLastAuthReturnTo]);

  if (!samplesEnabled) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  if (isLoading) {
    return <StateScreen title="Loading sample feature" message="Restoring access before opening the sample stack." loading />;
  }

  if (!session) {
    return (
      <Redirect
        href={{
          pathname: '/(public)/sign-in',
          params: { returnTo: serializeAuthReturnTo(currentAuthReturnTo) },
        }}
      />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.background },
      }}>
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="chat/thread" />
    </Stack>
  );
}
