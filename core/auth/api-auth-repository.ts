import { apiPost } from '@/core/api';
import { appEnv } from '@/core/env';
import {
  readSecureJson,
  removeSecureItem,
  writeSecureJson,
} from '@/core/storage/secure-store-json';
import {
  AuthRepository,
  AuthSession,
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
  UpdateProfileInput,
} from '@/core/auth/types';

const SESSION_KEY = 'fresh_app_auth_session';
const EXPIRY_LEEWAY_MS = 30_000;

type RemoteSessionPayload = {
  token: string;
  refreshToken?: string | null;
  expiresAt?: string | null;
  user: AuthSession['user'];
};

function normalizeSession(payload: RemoteSessionPayload): AuthSession {
  return {
    provider: 'remote',
    token: payload.token,
    refreshToken: payload.refreshToken ?? null,
    expiresAt: payload.expiresAt ?? null,
    user: payload.user,
  };
}

function isSessionExpired(session: AuthSession) {
  if (!session.expiresAt) {
    return false;
  }

  const expiresAt = Date.parse(session.expiresAt);

  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt <= Date.now() + EXPIRY_LEEWAY_MS;
}

async function readSession() {
  return readSecureJson<AuthSession | null>(SESSION_KEY, null);
}

async function persistSession(session: AuthSession) {
  await writeSecureJson(SESSION_KEY, session);
}

async function clearSession() {
  await removeSecureItem(SESSION_KEY);
}

async function postRemoteAuth<T>(path: string, payload?: unknown) {
  return apiPost<T>(path, payload);
}

export const apiAuthRepository: AuthRepository = {
  async restoreSession() {
    const session = await readSession();

    if (!session || session.provider === 'local') {
      return null;
    }

    if (!isSessionExpired(session)) {
      return session;
    }

    return apiAuthRepository.refreshSession(session);
  },

  async refreshSession(session) {
    if (session.provider === 'local' || !session.refreshToken) {
      await clearSession();
      return null;
    }

    try {
      const payload = await postRemoteAuth<RemoteSessionPayload>(appEnv.authPaths.refresh, {
        refreshToken: session.refreshToken,
      });
      const nextSession = normalizeSession(payload);
      await persistSession(nextSession);
      return nextSession;
    } catch {
      await clearSession();
      return null;
    }
  },

  async signIn(input) {
    const payload = await postRemoteAuth<RemoteSessionPayload>(appEnv.authPaths.signIn, input);
    const session = normalizeSession(payload);
    await persistSession(session);
    return session;
  },

  async signUp(input) {
    const payload = await postRemoteAuth<RemoteSessionPayload>(appEnv.authPaths.signUp, input);
    const session = normalizeSession(payload);
    await persistSession(session);
    return session;
  },

  async signOut() {
    const session = await readSession();

    try {
      if (session?.provider === 'remote') {
        await postRemoteAuth(appEnv.authPaths.signOut, {
          refreshToken: session.refreshToken ?? undefined,
        });
      }
    } finally {
      await clearSession();
    }
  },

  async requestPasswordReset(input: ForgotPasswordInput) {
    await postRemoteAuth(appEnv.authPaths.forgotPassword, input);
  },

  async updateProfile(input: UpdateProfileInput) {
    const payload = await postRemoteAuth<RemoteSessionPayload>(appEnv.authPaths.updateProfile, input);
    const session = normalizeSession(payload);
    await persistSession(session);
    return session;
  },
};
