import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useAppStore } from '@/core/store/app-store';
import { resolveColorScheme } from '@/hooks/use-color-scheme';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const themePreference = useAppStore((state) => state.themePreference);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const systemColorScheme = useRNColorScheme();

  if (hasHydrated) {
    return resolveColorScheme(themePreference, systemColorScheme);
  }

  return 'light';
}
