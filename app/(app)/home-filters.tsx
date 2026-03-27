import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useFeatureFlag } from '@/core/feature-flags';
import {
  DEFAULT_HOME_CHECKPOINT_IDS,
  useHomeFiltersStore,
} from '@/core/store/home-filters-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeFiltersScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const samplesStack = useFeatureFlag('samplesStack');
  const selectedCheckpointIds = useHomeFiltersStore((state) => state.selectedCheckpointIds);
  const showAiSample = useHomeFiltersStore((state) => state.showAiSample);
  const setHomeFilters = useHomeFiltersStore((state) => state.setHomeFilters);
  const [draftCheckpointIds, setDraftCheckpointIds] = useState<string[]>(selectedCheckpointIds);
  const [draftShowAiSample, setDraftShowAiSample] = useState(showAiSample);

  const toggleCheckpoint = (checkpointId: string) => {
    setDraftCheckpointIds((current) =>
      current.includes(checkpointId)
        ? current.filter((item) => item !== checkpointId)
        : [...current, checkpointId]
    );
  };

  const resetDraft = () => {
    setDraftCheckpointIds([...DEFAULT_HOME_CHECKPOINT_IDS]);
    setDraftShowAiSample(true);
  };

  const applyDraft = () => {
    setHomeFilters({
      checkpointIds: draftCheckpointIds,
      showAiSample: draftShowAiSample,
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: t('homeFilters.title') }} />
      <View style={[styles.screen, { backgroundColor: palette.canvas }]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 24 + Math.max(12, insets.bottom) },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <ThemedText type="subtitle">{t('homeFilters.title')}</ThemedText>
            <ThemedText style={{ color: palette.textMuted }}>
              {t('homeFilters.description')}
            </ThemedText>
          </View>

          <View
            style={[
              styles.section,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}>
            <View style={styles.sectionCopy}>
              <ThemedText type="defaultSemiBold">{t('homeFilters.checklistSection')}</ThemedText>
              <ThemedText style={{ color: palette.textMuted }}>
                {t('homeFilters.checklistHint')}
              </ThemedText>
            </View>

            {DEFAULT_HOME_CHECKPOINT_IDS.map((checkpointId) => {
              const selected = draftCheckpointIds.includes(checkpointId);

              return (
                <Pressable
                  key={checkpointId}
                  accessibilityRole="button"
                  onPress={() => toggleCheckpoint(checkpointId)}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: selected ? 'rgba(15, 98, 254, 0.08)' : palette.canvas,
                      borderColor: selected ? 'rgba(15, 98, 254, 0.24)' : palette.border,
                    },
                  ]}>
                  <View style={styles.optionCopy}>
                    <ThemedText type="defaultSemiBold">
                      {t(`homeFilters.${checkpointId}`)}
                    </ThemedText>
                  </View>
                  {selected ? (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={palette.tint} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {samplesStack ? (
            <View
              style={[
                styles.section,
                {
                  backgroundColor: palette.background,
                  borderColor: palette.border,
                },
              ]}>
              <View style={styles.sectionCopy}>
                <ThemedText type="defaultSemiBold">{t('homeFilters.surfaceSection')}</ThemedText>
                <ThemedText style={{ color: palette.textMuted }}>
                  {t('homeFilters.surfaceHint')}
                </ThemedText>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => setDraftShowAiSample((current) => !current)}
                style={[
                  styles.optionRow,
                  {
                    backgroundColor: draftShowAiSample
                      ? 'rgba(15, 98, 254, 0.08)'
                      : palette.canvas,
                    borderColor: draftShowAiSample
                      ? 'rgba(15, 98, 254, 0.24)'
                      : palette.border,
                  },
                ]}>
                <View style={styles.optionCopy}>
                  <ThemedText type="defaultSemiBold">{t('homeFilters.aiSample')}</ThemedText>
                  <ThemedText style={{ color: palette.textMuted }}>
                    {t('homeFilters.aiSampleDescription')}
                  </ThemedText>
                </View>
                {draftShowAiSample ? (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={palette.tint} />
                ) : null}
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.actionsBar,
            {
              backgroundColor: palette.canvas,
              borderTopColor: palette.border,
              paddingBottom: Math.max(12, insets.bottom),
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            onPress={resetDraft}
            style={[
              styles.secondaryButton,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}>
            <ThemedText type="defaultSemiBold">{t('homeFilters.reset')}</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={applyDraft}
            style={[
              styles.primaryButton,
              {
                backgroundColor: palette.tint,
              },
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.primaryLabel}>
              {t('homeFilters.apply')}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 18,
  },
  hero: {
    gap: 6,
    paddingTop: 4,
  },
  section: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  sectionCopy: {
    gap: 4,
  },
  optionRow: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  actionsBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    flex: 1.35,
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
});
