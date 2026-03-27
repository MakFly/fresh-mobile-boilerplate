import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useContext, useRef, useState, type ElementRef } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeClassifiedHeader } from '@/components/app/home-classified-header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { analytics } from '@/core/analytics';
import { useFeatureFlag } from '@/core/feature-flags';
import { useHomeFiltersStore } from '@/core/store/home-filters-store';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDashboardSummary } from '@/hooks/samples/use-dashboard-summary';

export default function HomeScreen() {
  const { t } = useTranslation();
  const scrollRef = useRef<ElementRef<typeof Animated.ScrollView>>(null);
  const samplesStack = useFeatureFlag('samplesStack');
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const user = useCurrentUser();
  const summary = useDashboardSummary();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const footerClearance =
    typeof tabBarHeight === 'number' ? tabBarHeight + 10 : Math.max(28, insets.bottom + 18);
  const [headerHeight, setHeaderHeight] = useState(0);
  const selectedCheckpointIds = useHomeFiltersStore((state) => state.selectedCheckpointIds);
  const showAiSample = useHomeFiltersStore((state) => state.showAiSample);
  const bodyMinHeight = Math.max(420, windowHeight - headerHeight - 8);
  const hasActiveFilters =
    selectedCheckpointIds.length !== 3 || (samplesStack ? showAiSample !== true : false);
  const visibleCheckpoints =
    summary.data?.checkpoints.filter((item) => selectedCheckpointIds.includes(item.id)) ?? [];

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({ onScroll: (e) => { scrollY.value = e.contentOffset.y; } });
  useScrollToTop(scrollRef);

  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const handleOpenFilters = () => {
    router.push('/(app)/home-filters');
  };

  useFocusEffect(
    useCallback(() => {
      analytics.screen('home');
    }, [])
  );

  return (
    <View style={[styles.screen, { backgroundColor: palette.canvas }]}>
      <HomeClassifiedHeader
        onLayout={handleHeaderLayout}
        scrollY={scrollY}
        onOpenFilters={handleOpenFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        style={[styles.scroll, { backgroundColor: palette.canvas }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.bodyShell,
            {
              minHeight: bodyMinHeight,
              backgroundColor: palette.background,
              borderColor: palette.border,
              paddingBottom: footerClearance,
            },
          ]}>
          <View style={styles.heroSection}>
            <View
              style={[
                styles.heroBadge,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)',
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText type="caption" style={{ color: palette.textSoft }}>
                {t('home.badge')}
              </ThemedText>
            </View>
            <ThemedText type="subtitle" style={{ fontSize: 29, lineHeight: 34 }}>
              {t('home.welcome', { name: user?.name ?? t('home.defaultName') })}
            </ThemedText>
            <ThemedText style={[styles.heroCopy, { color: palette.textMuted }]}>
              {t('home.description')}
            </ThemedText>
          </View>

          <View style={styles.statRow}>
            {summary.data?.stats.map((stat) => (
              <View
                key={stat.id}
                style={[
                  styles.statTile,
                  {
                    backgroundColor: palette.canvas,
                    borderColor: palette.border,
                  },
                ]}>
                <ThemedText type="caption" style={{ color: palette.textSoft }}>
                  {stat.label}
                </ThemedText>
                <ThemedText type="defaultSemiBold">{stat.value}</ThemedText>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: palette.canvas,
                borderColor: palette.border,
              },
            ]}>
            <View style={styles.rowTitle}>
              <ThemedText type="subtitle">{t('home.checklistTitle')}</ThemedText>
              {summary.isFetching ? <ActivityIndicator color={palette.tint} /> : null}
            </View>
            {visibleCheckpoints.length ? (
              visibleCheckpoints.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.checkRow,
                    index > 0
                      ? {
                          borderTopWidth: StyleSheet.hairlineWidth,
                          borderTopColor: palette.border,
                        }
                      : null,
                  ]}>
                  <View style={[styles.dotWrap, { backgroundColor: palette.overlay }]}>
                    <View style={[styles.dot, { backgroundColor: palette.success }]} />
                  </View>
                  <View style={styles.copy}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    <ThemedText style={{ color: palette.textMuted }}>{item.detail}</ThemedText>
                  </View>
                </View>
              ))
            ) : (
              <ThemedText style={{ color: palette.textMuted }}>
                {t('home.noResults')}
              </ThemedText>
            )}
          </View>

          {samplesStack && showAiSample ? (
            <Pressable
              style={[
                styles.featureRow,
                {
                  backgroundColor: palette.canvas,
                  borderColor: palette.border,
                },
              ]}
              onPress={() => router.push('/samples/chat')}>
              <View style={[styles.iconWrap, { backgroundColor: palette.overlay }]}>
                <IconSymbol name="sparkles" size={18} color={palette.text} />
              </View>
              <View style={styles.copy}>
                <ThemedText type="defaultSemiBold">{t('home.aiSampleTitle')}</ThemedText>
                <ThemedText style={{ color: palette.textMuted }}>
                  {t('home.aiSampleDescription')}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={18} color={palette.textSoft} />
            </Pressable>
          ) : null}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  bodyShell: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 18,
    overflow: 'hidden',
  },
  heroSection: {
    gap: 12,
    paddingTop: 6,
    paddingBottom: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    minHeight: 28,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  heroCopy: {
    maxWidth: 320,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statTile: {
    flex: 1,
    minWidth: 120,
    minHeight: 92,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 2,
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  dotWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    minHeight: 72,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
