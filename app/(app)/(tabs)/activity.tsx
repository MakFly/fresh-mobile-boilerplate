import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppShell } from '@/components/app/app-shell';
import { GlassSurface } from '@/components/glass/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDashboardSummary } from '@/hooks/samples/use-dashboard-summary';

export default function ActivityScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const summary = useDashboardSummary();

  return (
    <AppShell scroll safeAreaEdges={['left', 'right']} topInset={8}>
      <GlassSurface>
        <ThemedText type="caption" style={{ color: palette.textSoft }}>
          {t('activity.badge')}
        </ThemedText>
        <ThemedText type="title">{t('activity.title')}</ThemedText>
        <ThemedText style={{ color: palette.textMuted }}>
          {t('activity.description')}
        </ThemedText>
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('activity.latestCheckpoints')}</ThemedText>
        {summary.data?.checkpoints.map((item) => (
          <View key={item.id} style={styles.item}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={{ color: palette.textMuted }}>{item.detail}</ThemedText>
          </View>
        ))}
      </GlassSurface>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 4,
  },
});
