import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { StateScreen } from '@/components/app/state-screen';
import { authReturnToHref, resolveLaunchReturnTo } from '@/core/auth/return-to';
import { useAppStore } from '@/core/store/app-store';
import { useAuthSession, useCurrentUser } from '@/features/auth/hooks/use-auth';

export default function IndexRoute() {
  const { t } = useTranslation();
  const { isLoading } = useAuthSession();
  const user = useCurrentUser();
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);

  if (isLoading) {
    return <StateScreen title={t('common.loading')} message="Restoring session." loading />;
  }

  if (user) {
    return <Redirect href={authReturnToHref(lastAuthReturnTo)} />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href={authReturnToHref(resolveLaunchReturnTo(false, lastAuthReturnTo))} />;
}
