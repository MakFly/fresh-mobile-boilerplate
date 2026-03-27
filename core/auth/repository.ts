import { apiAuthRepository } from '@/core/auth/api-auth-repository';
import { localAuthRepository } from '@/core/auth/local-auth-repository';
import type { AuthRepository } from '@/core/auth/types';
import { appEnv, type AppEnv } from '@/core/env';

export function resolveAuthRepository(env: Pick<AppEnv, 'authMode' | 'isApiConfigured'>): AuthRepository {
  if (env.authMode === 'local') {
    return localAuthRepository;
  }

  if (env.authMode === 'remote') {
    return apiAuthRepository;
  }

  return env.isApiConfigured ? apiAuthRepository : localAuthRepository;
}

export const authRepository = resolveAuthRepository(appEnv);
