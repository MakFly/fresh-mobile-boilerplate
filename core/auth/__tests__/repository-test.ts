import { resolveAuthRepository } from '@/core/auth/repository';
import { localAuthRepository } from '@/core/auth/local-auth-repository';
import { apiAuthRepository } from '@/core/auth/api-auth-repository';

describe('resolveAuthRepository', () => {
  test('returns the local repository when auth mode is local', () => {
    expect(resolveAuthRepository({ authMode: 'local', isApiConfigured: true })).toBe(
      localAuthRepository
    );
  });

  test('returns the remote repository when auth mode is remote', () => {
    expect(resolveAuthRepository({ authMode: 'remote', isApiConfigured: false })).toBe(
      apiAuthRepository
    );
  });

  test('returns the remote repository in auto mode when the API is configured', () => {
    expect(resolveAuthRepository({ authMode: 'auto', isApiConfigured: true })).toBe(
      apiAuthRepository
    );
  });

  test('returns the local repository in auto mode when the API is not configured', () => {
    expect(resolveAuthRepository({ authMode: 'auto', isApiConfigured: false })).toBe(
      localAuthRepository
    );
  });
});
