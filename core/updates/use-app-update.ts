import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { toast } from 'sonner-native';

export function useAppUpdateCheck() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) {
      return;
    }

    const check = async () => {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          toast('Update ready', {
            description: 'Restart the app to apply the latest bundle.',
          });
        }
      } catch {
        // ignore transient update errors
      }
    };

    void check();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void check();
      }
    });
    return () => sub.remove();
  }, []);
}
