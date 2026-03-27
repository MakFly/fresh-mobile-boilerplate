import {
  AuthRepository,
  AuthSession,
  AuthUser,
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
  UpdateProfileInput,
} from '@/core/auth/types';
import {
  readSecureJson,
  removeSecureItem,
  writeSecureJson,
} from '@/core/storage/secure-store-json';

const USERS_KEY = 'fresh_app_auth_users';
const SESSION_KEY = 'fresh_app_auth_session';
const DEMO_USER_EMAIL = 'demo@fresh.app';
const DEMO_USER_PASSWORD = 'password123';

type StoredUser = AuthUser & {
  password: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createToken() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createDemoUser(): StoredUser {
  return {
    id: 'user_demo',
    email: DEMO_USER_EMAIL,
    name: 'Demo User',
    password: DEMO_USER_PASSWORD,
  };
}

async function readUsers() {
  const users = await readSecureJson<StoredUser[]>(USERS_KEY, []);

  if (users.length === 0) {
    const seededUsers = [createDemoUser()];
    await writeSecureJson(USERS_KEY, seededUsers);
    return seededUsers;
  }

  if (!users.some((user) => user.email === DEMO_USER_EMAIL)) {
    const seededUsers = [createDemoUser(), ...users];
    await writeSecureJson(USERS_KEY, seededUsers);
    return seededUsers;
  }

  return users;
}

async function writeUsers(users: StoredUser[]) {
  await writeSecureJson(USERS_KEY, users);
}

async function persistSession(session: AuthSession) {
  await writeSecureJson(SESSION_KEY, session);
}

function createSession(user: AuthUser): AuthSession {
  return {
    provider: 'local',
    token: createToken(),
    user,
  };
}

export const localAuthRepository: AuthRepository = {
  async restoreSession() {
    await wait(250);
    const session = await readSecureJson<AuthSession | null>(SESSION_KEY, null);

    if (!session) {
      return null;
    }

    if (session.provider && session.provider !== 'local') {
      return null;
    }

    return {
      ...session,
      provider: 'local',
    };
  },

  async refreshSession(session) {
    return session.provider === 'remote' ? null : { ...session, provider: 'local' };
  },

  async signIn(input: SignInInput) {
    await wait(350);
    const email = normalizeEmail(input.email);
    const users = await readUsers();
    const match = users.find((user) => user.email === email);

    if (!match || match.password !== input.password) {
      throw new Error('Invalid email or password.');
    }

    const session = createSession({
      id: match.id,
      email: match.email,
      name: match.name,
    });

    await persistSession(session);
    return session;
  },

  async signUp(input: SignUpInput) {
    await wait(400);
    const email = normalizeEmail(input.email);
    const users = await readUsers();

    if (users.some((user) => user.email === email)) {
      throw new Error('An account already exists for this email.');
    }

    const nextUser: StoredUser = {
      id: `user_${Date.now()}`,
      email,
      name: input.name.trim(),
      password: input.password,
    };

    const nextUsers = [nextUser, ...users];
    await writeUsers(nextUsers);

    const session = createSession({
      id: nextUser.id,
      email: nextUser.email,
      name: nextUser.name,
    });

    await persistSession(session);
    return session;
  },

  async signOut() {
    await wait(150);
    await removeSecureItem(SESSION_KEY);
  },

  async requestPasswordReset(input: ForgotPasswordInput) {
    await wait(300);
    const email = normalizeEmail(input.email);
    const users = await readUsers();

    if (!users.some((user) => user.email === email)) {
      throw new Error('No account matches this email.');
    }
  },

  async updateProfile(input: UpdateProfileInput) {
    await wait(300);
    const session = await readSecureJson<AuthSession | null>(SESSION_KEY, null);

    if (!session) {
      throw new Error('No active session.');
    }

    const users = await readUsers();
    const nextUsers = users.map((user) =>
      user.id === session.user.id
        ? {
            ...user,
            name: input.name.trim(),
          }
        : user
    );

    const nextSession: AuthSession = {
      ...session,
      user: {
        ...session.user,
        name: input.name.trim(),
      },
    };

    await writeUsers(nextUsers);
    await persistSession(nextSession);
    return nextSession;
  },
};
