import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { AppShell } from '@/components/app/app-shell';
import { GlassSurface } from '@/components/glass/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useFeatureFlag } from '@/core/feature-flags';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function GlassScreen() {
  const { t } = useTranslation();
  const samplesStack = useFeatureFlag('samplesStack');
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <AppShell scroll safeAreaEdges={['left', 'right']} topInset={8}>
      <GlassSurface variant="hero">
        <ThemedText type="caption" style={{ color: palette.textSoft }}>
          {t('glass.badge')}
        </ThemedText>
        <ThemedText type="hero" style={{ fontFamily: Fonts.serif, fontSize: 40, lineHeight: 44 }}>
          {t('glass.title')}
        </ThemedText>
        <ThemedText style={{ color: palette.textMuted }}>
          {t('glass.description')}
        </ThemedText>
      </GlassSurface>

      <View style={styles.grid}>
        <GlassSurface style={styles.tile}>
          <View style={[styles.iconWrap, { backgroundColor: palette.overlay }]}>
            <IconSymbol name="sparkles" size={18} color={palette.text} />
          </View>
          <ThemedText type="defaultSemiBold">{t('glass.primaryGlassTitle')}</ThemedText>
          <ThemedText style={{ color: palette.textMuted }}>
            {t('glass.primaryGlassDescription')}
          </ThemedText>
        </GlassSurface>

        <GlassSurface style={styles.tile}>
          <View style={[styles.iconWrap, { backgroundColor: palette.overlay }]}>
            <IconSymbol name="checkmark.circle.fill" size={18} color={palette.text} />
          </View>
          <ThemedText type="defaultSemiBold">{t('glass.toastsTitle')}</ThemedText>
          <ThemedText style={{ color: palette.textMuted }}>
            {t('glass.toastsDescription')}
          </ThemedText>
        </GlassSurface>
      </View>

      <GlassSurface>
        <ThemedText type="subtitle">{t('glass.interactionsTitle')}</ThemedText>
        <View style={styles.actions}>
          <Button
            className="rounded-2xl"
            onPress={() =>
              toast.success(t('glass.toastSuccessTitle'), {
                description: t('glass.toastSuccessDescription'),
              })
            }>
            <ThemedText type="defaultSemiBold" style={{ color: '#FFFFFF' }}>
              {t('glass.showSuccessToast')}
            </ThemedText>
          </Button>
          {samplesStack ? (
            <Button className="rounded-2xl" variant="outline" onPress={() => router.push('/samples/chat')}>
              <ThemedText type="defaultSemiBold">{t('glass.openAiSample')}</ThemedText>
            </Button>
          ) : null}
        </View>
      </GlassSurface>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  tile: {
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
  },
});
