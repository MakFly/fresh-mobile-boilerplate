import { Redirect, Stack, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { StateScreen } from '@/components/app/state-screen';
import { authReturnToHref, sanitizeAuthReturnTo } from '@/core/auth/return-to';
import { Colors, Fonts } from '@/constants/theme';
import { useAppStore } from '@/core/store/app-store';
import { useCurrentUser, useAuthSession } from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PublicLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { isLoading } = useAuthSession();
  const user = useCurrentUser();
  const params = useGlobalSearchParams<{ returnTo?: string | string[] }>();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const returnTo = sanitizeAuthReturnTo(params.returnTo, lastAuthReturnTo);

  if (isLoading) {
    return (
      <StateScreen
        title={t('common.loadingSessionTitle')}
        message={t('common.loadingSessionMessage')}
        loading
      />
    );
  }

  if (user) {
    return <Redirect href={authReturnToHref(returnTo)} />;
  }

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
      <Stack.Screen name="sign-in" options={{ title: t('signIn.signIn') }} />
      <Stack.Screen name="sign-up" options={{ title: t('signUp.createAccount') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('forgotPassword.navTitle') }} />
    </Stack>
  );
}
