export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  token: string;
  refreshToken?: string | null;
  expiresAt?: string | null;
  provider?: 'local' | 'remote';
  user: AuthUser;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

export type UpdateProfileInput = {
  name: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type AuthRepository = {
  restoreSession: () => Promise<AuthSession | null>;
  refreshSession: (session: AuthSession) => Promise<AuthSession | null>;
  signIn: (input: SignInInput) => Promise<AuthSession>;
  signUp: (input: SignUpInput) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  requestPasswordReset: (input: ForgotPasswordInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<AuthSession>;
};
