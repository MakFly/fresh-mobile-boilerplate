import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TITLE_HEIGHT = 42;

/** Maps scroll 0→TITLE_HEIGHT to a 0→1 progress (smoothstep = doux en entrée/sortie). */
function collapseProgress(scroll: number) {
  'worklet';
  const t = interpolate(scroll, [0, TITLE_HEIGHT], [0, 1], Extrapolation.CLAMP);
  return t * t * (3 - 2 * t);
}

type Props = {
  onLayout?: (event: LayoutChangeEvent) => void;
  scrollY: SharedValue<number>;
  onOpenFilters: () => void;
  hasActiveFilters?: boolean;
};

export function HomeClassifiedHeader({
  onLayout,
  scrollY,
  onOpenFilters,
  hasActiveFilters = false,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [query, setQuery] = useState('');

  const titleStyle = useAnimatedStyle(() => {
    const p = collapseProgress(scrollY.value);
    return {
      height: interpolate(p, [0, 1], [TITLE_HEIGHT, 0]),
      opacity: interpolate(p, [0, 0.5], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(p, [0, 1], [0, -12]) }],
    };
  });

  const searchStyle = useAnimatedStyle(() => {
    const p = collapseProgress(scrollY.value);
    return {
      transform: [
        { translateY: interpolate(p, [0, 1], [0, -2]) },
        { scale: interpolate(p, [0, 1], [1, 1.015]) },
      ],
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    const p = collapseProgress(scrollY.value);
    return {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
      opacity: interpolate(p, [0.35, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={{ backgroundColor: palette.canvas }} onLayout={onLayout}>
      <View style={[styles.inner, { paddingTop: insets.top + 8 }]}>
        <Animated.Text
          style={[styles.title, { color: palette.text, fontFamily: Fonts.sans }, titleStyle]}
          numberOfLines={1}>
          {t('tabs.home')}
        </Animated.Text>

        <Animated.View style={searchStyle}>
          <View
            style={[
              styles.searchRow,
              {
                backgroundColor:
                  Platform.OS === 'ios'
                    ? colorScheme === 'dark'
                      ? 'rgba(28, 36, 46, 0.66)'
                      : 'rgba(255, 255, 255, 0.72)'
                    : palette.background,
                borderColor: palette.border,
                shadowColor: palette.shadow,
              },
            ]}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={26} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            ) : null}
            <IconSymbol name="magnifyingglass" size={20} color={palette.textSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('home.searchPlaceholder')}
              placeholderTextColor={palette.textSoft}
              style={[styles.input, { color: palette.text }]}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('home.filters')}
              hitSlop={10}
              onPress={onOpenFilters}
              style={[
                styles.filterHit,
                hasActiveFilters
                  ? {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? 'rgba(167, 203, 255, 0.16)'
                          : 'rgba(15, 98, 254, 0.12)',
                    }
                  : null,
              ]}>
              <IconSymbol
                name="slider.horizontal.3"
                size={20}
                color={hasActiveFilters ? palette.tint : palette.textMuted}
              />
            </Pressable>
          </View>
        </Animated.View>
      </View>
      <Animated.View style={borderStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    overflow: 'hidden',
  },
  searchRow: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 48,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  filterHit: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
