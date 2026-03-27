import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

export type PickedImage = {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string | null;
};

export function useImagePicker() {
  const [busy, setBusy] = useState(false);

  const ensurePermission = useCallback(async (type: 'camera' | 'library') => {
    const permission =
      type === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    return permission.granted;
  }, []);

  const pickFromLibrary = useCallback(async (): Promise<PickedImage | null> => {
    setBusy(true);
    try {
      const ok = await ensurePermission('library');
      if (!ok) return null;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) {
        return null;
      }
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType,
      };
    } finally {
      setBusy(false);
    }
  }, [ensurePermission]);

  const takePhoto = useCallback(async (): Promise<PickedImage | null> => {
    setBusy(true);
    try {
      const ok = await ensurePermission('camera');
      if (!ok) return null;
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) {
        return null;
      }
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType,
      };
    } finally {
      setBusy(false);
    }
  }, [ensurePermission]);

  return {
    busy,
    pickFromLibrary,
    takePhoto,
  };
}
