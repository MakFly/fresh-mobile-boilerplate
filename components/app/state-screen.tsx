import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/glass/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StateScreenProps = {
  title: string;
  message: string;
  loading?: boolean;
};

export function StateScreen({ title, message, loading = false }: StateScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <GlassSurface style={styles.card}>
        {loading ? <ActivityIndicator color={palette.tint} /> : null}
        <ThemedText type="subtitle" style={styles.center}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.center, { color: palette.textMuted }]}>{message}</ThemedText>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 10,
  },
  center: {
    textAlign: 'center',
  },
});
