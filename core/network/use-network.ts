import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkState() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    void NetInfo.fetch().then((state) => {
      if (!mounted) return;
      setIsOnline(Boolean(state.isConnected));
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected));
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline };
}
