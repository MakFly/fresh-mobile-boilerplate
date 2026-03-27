import { useEffect } from 'react';

import { setApiAuthToken } from '@/core/api/auth-token';
import { useAuthSession } from '@/features/auth/hooks/use-auth';

export function AuthTokenSync() {
  const { data: session } = useAuthSession();

  useEffect(() => {
    setApiAuthToken(session?.token ?? null);
  }, [session?.token]);

  return null;
}
