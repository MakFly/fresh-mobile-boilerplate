import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StateScreen } from '@/components/app/state-screen';
import { authReturnToHref, resolveLaunchReturnTo } from '@/core/auth/return-to';
import { useAppStore } from '@/core/store/app-store';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuthSession, useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

type Slide = { key: string; titleKey: string; bodyKey: string };

const slides: Slide[] = [
  { key: '1', titleKey: 'onboarding.slide1Title', bodyKey: 'onboarding.slide1Body' },
  { key: '2', titleKey: 'onboarding.slide2Title', bodyKey: 'onboarding.slide2Body' },
  { key: '3', titleKey: 'onboarding.slide3Title', bodyKey: 'onboarding.slide3Body' },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { isLoading } = useAuthSession();
  const user = useCurrentUser();
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const setHasCompletedOnboarding = useAppStore((state) => state.setHasCompletedOnboarding);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setIndex(Math.round(x / width));
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <ThemedText type="title">{t(item.titleKey)}</ThemedText>
      <ThemedText style={{ color: palette.textMuted }}>{t(item.bodyKey)}</ThemedText>
    </View>
  );

  const goNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      setHasCompletedOnboarding(true);
      router.replace(authReturnToHref(resolveLaunchReturnTo(Boolean(user), lastAuthReturnTo)));
    }
  };

  if (isLoading) {
    return (
      <StateScreen
        title={t('common.loading')}
        message={t('common.restoringSession')}
        loading
      />
    );
  }

  if (user) {
    return <Redirect href={authReturnToHref(lastAuthReturnTo)} />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href={authReturnToHref(resolveLaunchReturnTo(false, lastAuthReturnTo))} />;
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: palette.background,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        },
      ]}>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={slides}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />
      <View style={styles.dots}>
        {slides.map((s, i) => (
          <View
            key={s.key}
            style={[styles.dot, { backgroundColor: i === index ? palette.tint : palette.borderStrong }]}
          />
        ))}
      </View>
      <Pressable onPress={goNext} style={[styles.cta, { backgroundColor: palette.tint }]} accessibilityRole="button">
        <ThemedText type="defaultSemiBold" style={styles.ctaLabel}>
          {index === slides.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 8,
    gap: 12,
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#FFFFFF',
  },
});
