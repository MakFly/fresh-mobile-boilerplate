import type { ConfigContext, ExpoConfig } from 'expo/config';

const {
  getAndroidIntentFilters,
  getAssociatedDomains,
  getLinkingPrefixes,
  resolveAppEnv,
} = require('./core/env/shared.ts') as typeof import('./core/env/shared');

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = resolveAppEnv(process.env);
  const existingExtra = config.extra ?? {};
  const existingIosAssociatedDomains = config.ios?.associatedDomains ?? [];
  const existingAndroidIntentFilters = config.android?.intentFilters ?? [];

  return {
    ...config,
    name: config.name ?? 'fresh-app',
    slug: config.slug ?? 'fresh-app',
    version: config.version ?? '1.0.0',
    scheme: env.appScheme,
    ios: {
      ...config.ios,
      associatedDomains: Array.from(
        new Set([...existingIosAssociatedDomains, ...getAssociatedDomains(env)])
      ),
    },
    android: {
      ...config.android,
      intentFilters: [...existingAndroidIntentFilters, ...getAndroidIntentFilters(env)],
    },
    extra: {
      ...existingExtra,
      appEnv: env.appEnv,
      apiUrl: env.apiUrl ?? null,
      authMode: env.authMode,
      linking: {
        domains: env.appLinkHosts,
        prefixes: getLinkingPrefixes(env),
      },
      eas: {
        ...(existingExtra.eas ?? {}),
        projectId: env.easProjectId ?? existingExtra.eas?.projectId,
      },
    },
  };
};
