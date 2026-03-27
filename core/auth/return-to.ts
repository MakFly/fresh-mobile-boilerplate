export type AuthReturnTo =
  | { pathname: '/(app)/(tabs)' }
  | { pathname: '/(app)/(tabs)/activity' }
  | { pathname: '/(app)/(tabs)/glass' }
  | { pathname: '/(app)/(tabs)/settings' }
  | { pathname: '/samples/chat' }
  | { pathname: '/samples/chat/thread'; params: { threadId: string } };

type AuthReturnToInput = AuthReturnTo | string;

export const DEFAULT_AUTH_RETURN_TO: AuthReturnTo = { pathname: '/(app)/(tabs)' };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getSingleValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function coerceSimplePathname(pathname: unknown): AuthReturnTo | null {
  if (pathname === '/(app)/(tabs)' || pathname === '/(app)/(tabs)/index') {
    return { pathname: '/(app)/(tabs)' };
  }

  if (pathname === '/(app)/(tabs)/activity') {
    return { pathname: '/(app)/(tabs)/activity' };
  }

  if (pathname === '/(app)/(tabs)/glass') {
    return { pathname: '/(app)/(tabs)/glass' };
  }

  if (pathname === '/(app)/(tabs)/settings') {
    return { pathname: '/(app)/(tabs)/settings' };
  }

  if (pathname === '/samples/chat' || pathname === '/samples/chat/index') {
    return { pathname: '/samples/chat' };
  }

  return null;
}

function coerceThreadReturnTo(value: unknown): AuthReturnTo | null {
  if (!value || typeof value !== 'object') return null;

  const params =
    'params' in value && value.params && typeof value.params === 'object'
      ? value.params
      : null;
  const threadId = params && 'threadId' in params ? getSingleValue(params.threadId) : null;

  if (!isNonEmptyString(threadId)) {
    return null;
  }

  return {
    pathname: '/samples/chat/thread',
    params: { threadId },
  };
}

function coerceAuthReturnTo(value: unknown): AuthReturnTo | null {
  const singleValue = getSingleValue(value);

  if (typeof singleValue === 'string') {
    const simplePath = coerceSimplePathname(singleValue);
    if (simplePath) return simplePath;

    try {
      return coerceAuthReturnTo(JSON.parse(singleValue));
    } catch {
      return null;
    }
  }

  if (!singleValue || typeof singleValue !== 'object') {
    return null;
  }

  const pathname = 'pathname' in singleValue ? getSingleValue(singleValue.pathname) : null;

  if (pathname === '/samples/chat/thread') {
    return coerceThreadReturnTo(singleValue);
  }

  return coerceSimplePathname(pathname);
}

export function serializeAuthReturnTo(returnTo: AuthReturnTo) {
  return JSON.stringify(returnTo);
}

export function sanitizeAuthReturnTo(
  value: unknown,
  fallback: AuthReturnTo = DEFAULT_AUTH_RETURN_TO
): AuthReturnTo {
  return coerceAuthReturnTo(value) ?? fallback;
}

export function authReturnToHref(returnTo: AuthReturnTo) {
  if (returnTo.pathname === '/samples/chat/thread') {
    return {
      pathname: returnTo.pathname,
      params: returnTo.params,
    } as const;
  }

  return returnTo.pathname;
}

export function areAuthReturnToEqual(left: AuthReturnTo, right: AuthReturnTo) {
  if (left.pathname !== right.pathname) return false;

  if (left.pathname === '/samples/chat/thread' && right.pathname === '/samples/chat/thread') {
    return left.params.threadId === right.params.threadId;
  }

  return true;
}

export function getAuthReturnToFromSegments(
  segments: string[],
  params?: Record<string, unknown>
): AuthReturnTo {
  const joined = `/${segments.join('/')}`;

  if (joined === '/samples/chat/thread') {
    const threadId = params ? getSingleValue(params.threadId) : null;

    if (isNonEmptyString(threadId)) {
      return {
        pathname: '/samples/chat/thread',
        params: { threadId },
      };
    }

    return { pathname: '/samples/chat' };
  }

  return coerceSimplePathname(joined) ?? DEFAULT_AUTH_RETURN_TO;
}

export function isAuthRequiredAuthReturnTo(returnTo: AuthReturnTo) {
  return (
    returnTo.pathname === '/(app)/(tabs)/settings' ||
    returnTo.pathname === '/samples/chat' ||
    returnTo.pathname === '/samples/chat/thread'
  );
}

export function resolveLaunchReturnTo(
  isAuthenticated: boolean,
  lastAuthReturnTo: AuthReturnTo
): AuthReturnTo {
  if (!isAuthenticated && isAuthRequiredAuthReturnTo(lastAuthReturnTo)) {
    return DEFAULT_AUTH_RETURN_TO;
  }

  return lastAuthReturnTo;
}

export type LegacyProtectedReturnToInput = AuthReturnToInput;
