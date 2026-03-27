import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { resolveAppEnv, type ResolvedAppEnv } from '@/core/env/shared';

type AppEnv = ResolvedAppEnv & {
  hasConfigurationIssues: boolean;
};

const runtimeProcessEnv = {
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
  EXPO_PUBLIC_API_URL:
    process.env.EXPO_PUBLIC_API_URL ??
    (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
    undefined,
  EXPO_PUBLIC_AUTH_MODE:
    process.env.EXPO_PUBLIC_AUTH_MODE ??
    (Constants.expoConfig?.extra?.authMode as string | undefined) ??
    undefined,
  EXPO_PUBLIC_EAS_PROJECT_ID:
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
    (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
    undefined,
  EXPO_PUBLIC_APP_LINK_HOSTS:
    process.env.EXPO_PUBLIC_APP_LINK_HOSTS ??
    ((Constants.expoConfig?.extra?.linking?.domains as string[] | undefined)?.join(',') ??
      undefined),
};

const resolvedRuntimeEnv = resolveAppEnv(runtimeProcessEnv);

export const appEnv: AppEnv = {
  ...resolvedRuntimeEnv,
  hasConfigurationIssues: resolvedRuntimeEnv.validationIssues.length > 0,
};

export type { AppEnv };

export function getApiSetupHint() {
  if (appEnv.validationIssues.length > 0) {
    return appEnv.validationIssues[0]!;
  }

  if (Platform.OS === 'web') {
    return 'Define EXPO_PUBLIC_API_URL to point to your API origin.';
  }

  return 'Define EXPO_PUBLIC_API_URL with a host reachable from your simulator or device. Avoid localhost on a physical phone.';
}
