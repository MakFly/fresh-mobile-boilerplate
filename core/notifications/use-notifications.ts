import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { logger } from '@/core/logger';

export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [isGranted, setIsGranted] = useState(false);

  useEffect(() => {
    void Notifications.getPermissionsAsync().then(({ status }) => {
      setIsGranted(status === 'granted');
    });
  }, []);

  const refreshToken = useCallback(async () => {
    if (!Device.isDevice) {
      logger.debug('Push notifications require a physical device');
      return null;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    const projectId =
      (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
      process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
    try {
      const expoToken = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      setToken(expoToken.data);
      return expoToken.data;
    } catch (error) {
      logger.warn('Expo push token unavailable', { message: String(error) });
      return null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    setIsGranted(finalStatus === 'granted');
    if (finalStatus !== 'granted') {
      return false;
    }
    await refreshToken();
    return true;
  }, [refreshToken]);

  return {
    token,
    isGranted,
    requestPermission,
    refreshToken,
  };
}
