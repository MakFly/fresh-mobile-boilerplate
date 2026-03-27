import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useNetworkState } from '@/core/network/use-network';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function OfflineBanner() {
  const { isOnline } = useNetworkState();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  if (isOnline) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor: palette.tint }]} accessibilityRole="alert">
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {t('offline.banner')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
