declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_APP_ENV?: 'development' | 'preview' | 'production';
    EXPO_PUBLIC_APP_SCHEME?: string;
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_AUTH_MODE?: 'auto' | 'local' | 'remote';
    EXPO_PUBLIC_EAS_PROJECT_ID?: string;
    EXPO_PUBLIC_APP_LINK_HOSTS?: string;
  }
}
