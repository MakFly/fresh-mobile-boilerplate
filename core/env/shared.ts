import { z } from 'zod';

export type AppEnvironment = 'development' | 'preview' | 'production';
export type AuthMode = 'auto' | 'local' | 'remote';

type ResolvedAppEnv = {
  appEnv: AppEnvironment;
  appScheme: string;
  apiUrl?: string;
  authMode: AuthMode;
  easProjectId?: string;
  appLinkHosts: string[];
  authPaths: {
    signIn: string;
    signUp: string;
    signOut: string;
    refresh: string;
    forgotPassword: string;
    updateProfile: string;
  };
  isApiConfigured: boolean;
  isRemoteAuthEnabled: boolean;
  validationIssues: string[];
};

const rawEnvSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'preview', 'production']).optional(),
  EXPO_PUBLIC_APP_SCHEME: z.string().optional(),
  EXPO_PUBLIC_API_URL: z.string().optional(),
  EXPO_PUBLIC_AUTH_MODE: z.enum(['auto', 'local', 'remote']).optional(),
  EXPO_PUBLIC_EAS_PROJECT_ID: z.string().optional(),
  EXPO_PUBLIC_APP_LINK_HOSTS: z.string().optional(),
});

function normalizeString(value: string | undefined) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : undefined;
}

function normalizePath(path: string) {
  const trimmedPath = path.trim().replace(/^\/+/, '');
  return trimmedPath.length > 0 ? trimmedPath : '';
}

function normalizeApiUrl(raw: string | undefined) {
  if (!raw) return undefined;

  const trimmedValue = raw.trim();
  if (!trimmedValue) return undefined;

  return trimmedValue.replace(/\/+$/, '');
}

function normalizeLinkHosts(raw: string | undefined) {
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(',')
        .map((segment) => segment.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

export function resolveAppEnv(
  source: Record<string, string | undefined> = process.env
): ResolvedAppEnv {
  const parsedEnv = rawEnvSchema.safeParse(source);
  const validationIssues = parsedEnv.success
    ? []
    : parsedEnv.error.issues.map((issue) => issue.message);
  const data = parsedEnv.success ? parsedEnv.data : {};
  const apiUrl = normalizeApiUrl(normalizeString(data.EXPO_PUBLIC_API_URL));
  const appScheme = normalizeString(data.EXPO_PUBLIC_APP_SCHEME) ?? 'freshapp';
  const authMode = data.EXPO_PUBLIC_AUTH_MODE ?? 'auto';
  const appLinkHosts = normalizeLinkHosts(data.EXPO_PUBLIC_APP_LINK_HOSTS);
  const resolvedEnv: ResolvedAppEnv = {
    appEnv: data.EXPO_PUBLIC_APP_ENV ?? 'development',
    appScheme,
    apiUrl,
    authMode,
    easProjectId: normalizeString(data.EXPO_PUBLIC_EAS_PROJECT_ID),
    appLinkHosts,
    authPaths: {
      signIn: 'auth/sign-in',
      signUp: 'auth/sign-up',
      signOut: 'auth/sign-out',
      refresh: 'auth/refresh',
      forgotPassword: 'auth/forgot-password',
      updateProfile: 'auth/profile',
    },
    isApiConfigured: Boolean(apiUrl),
    isRemoteAuthEnabled: authMode === 'remote' || (authMode === 'auto' && Boolean(apiUrl)),
    validationIssues,
  };

  if (resolvedEnv.authMode === 'remote' && !resolvedEnv.apiUrl) {
    resolvedEnv.validationIssues.push(
      'EXPO_PUBLIC_AUTH_MODE=remote requires EXPO_PUBLIC_API_URL.'
    );
  }

  return resolvedEnv;
}

export function getAssociatedDomains(env: ResolvedAppEnv) {
  return env.appLinkHosts.map((host) => `applinks:${host}`);
}

export function getAndroidIntentFilters(env: ResolvedAppEnv) {
  if (env.appLinkHosts.length === 0) {
    return [];
  }

  return [
    {
      action: 'VIEW',
      autoVerify: true,
      data: env.appLinkHosts.map((host) => ({
        scheme: 'https',
        host,
        pathPrefix: '/',
      })),
      category: ['BROWSABLE', 'DEFAULT'],
    },
  ];
}

export function getLinkingPrefixes(env: ResolvedAppEnv) {
  const customSchemePrefix = `${env.appScheme}://`;

  return [
    customSchemePrefix,
    ...env.appLinkHosts.flatMap((host) => [`https://${host}`, `http://${host}`]),
  ];
}

export function getNormalizedApiPath(path: string) {
  return normalizePath(path);
}

export type { ResolvedAppEnv };
