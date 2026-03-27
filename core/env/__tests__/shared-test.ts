import { getAndroidIntentFilters, getAssociatedDomains, resolveAppEnv } from '@/core/env/shared';

describe('resolveAppEnv', () => {
  test('uses sensible defaults', () => {
    const env = resolveAppEnv({});

    expect(env.appEnv).toBe('development');
    expect(env.appScheme).toBe('freshapp');
    expect(env.authMode).toBe('auto');
    expect(env.isApiConfigured).toBe(false);
    expect(env.isRemoteAuthEnabled).toBe(false);
    expect(env.appLinkHosts).toEqual([]);
  });

  test('enables remote auth automatically when an API URL exists', () => {
    const env = resolveAppEnv({
      EXPO_PUBLIC_API_URL: 'https://api.example.com/',
      EXPO_PUBLIC_APP_LINK_HOSTS: 'app.example.com,app.example.com,preview.example.com',
    });

    expect(env.apiUrl).toBe('https://api.example.com');
    expect(env.isRemoteAuthEnabled).toBe(true);
    expect(env.appLinkHosts).toEqual(['app.example.com', 'preview.example.com']);
  });

  test('flags an invalid remote auth configuration', () => {
    const env = resolveAppEnv({
      EXPO_PUBLIC_AUTH_MODE: 'remote',
    });

    expect(env.validationIssues).toContain(
      'EXPO_PUBLIC_AUTH_MODE=remote requires EXPO_PUBLIC_API_URL.'
    );
  });

  test('builds mobile app-link config from domains', () => {
    const env = resolveAppEnv({
      EXPO_PUBLIC_APP_LINK_HOSTS: 'app.example.com',
    });

    expect(getAssociatedDomains(env)).toEqual(['applinks:app.example.com']);
    expect(getAndroidIntentFilters(env)).toEqual([
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: 'https', host: 'app.example.com', pathPrefix: '/' }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ]);
  });
});
