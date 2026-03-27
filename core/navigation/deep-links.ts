function trimTrailingSlash(value: string) {
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
}

function normalizeRawPath(rawPath: string | null | undefined) {
  if (!rawPath) {
    return '/';
  }

  try {
    const url = rawPath.includes('://')
      ? new URL(rawPath)
      : new URL(rawPath, 'freshapp://placeholder');
    const isHttp = url.protocol === 'https:' || url.protocol === 'http:';
    const pathSource = isHttp
      ? url.pathname
      : `/${[url.host === 'placeholder' ? '' : url.host, url.pathname]
          .filter(Boolean)
          .join('/')}`;
    const normalizedPath = trimTrailingSlash(pathSource.replace(/\/+/g, '/')) || '/';

    return `${normalizedPath}${url.search}`;
  } catch {
    const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    return trimTrailingSlash(normalizedPath.replace(/\/+/g, '/')) || '/';
  }
}

export function normalizeInboundPath(rawPath: string | null | undefined) {
  const normalizedPath = normalizeRawPath(rawPath);
  const [pathname, search = ''] = normalizedPath.split('?');
  const nextPathname = trimTrailingSlash(pathname || '/');

  if (nextPathname === '/login' || nextPathname === '/sign-in') {
    return '/(public)/sign-in';
  }

  if (nextPathname === '/signup' || nextPathname === '/register' || nextPathname === '/sign-up') {
    return '/(public)/sign-up';
  }

  if (
    nextPathname === '/forgot-password' ||
    nextPathname === '/reset-password' ||
    nextPathname === '/password/reset'
  ) {
    return '/(public)/forgot-password';
  }

  if (nextPathname === '/settings') {
    return '/(app)/(tabs)/settings';
  }

  if (nextPathname === '/activity') {
    return '/(app)/(tabs)/activity';
  }

  if (nextPathname === '/glass') {
    return '/(app)/(tabs)/glass';
  }

  if (nextPathname === '/chat' || nextPathname === '/samples/chat') {
    return '/samples/chat';
  }

  if (nextPathname === '/samples/chat/thread' && search) {
    return `${nextPathname}?${search}`;
  }

  const chatThreadMatch = nextPathname.match(/^\/(?:chat|samples\/chat)\/([^/]+)$/);

  if (chatThreadMatch?.[1]) {
    return `/samples/chat/thread?threadId=${encodeURIComponent(chatThreadMatch[1])}`;
  }

  return normalizedPath;
}
