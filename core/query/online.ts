import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

let didRegister = false;

export function registerQueryOnlineListener() {
  if (didRegister) {
    return;
  }
  didRegister = true;

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOnline(online);
    });
  });
}
