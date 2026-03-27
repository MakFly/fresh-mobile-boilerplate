import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useFeatureFlag } from '@/core/feature-flags';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppTabsLayout() {
  const { t } = useTranslation();
  const glassLab = useFeatureFlag('glassLab');
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.canvas },
        headerTintColor: palette.text,
        headerTitleStyle: {
          fontFamily: Fonts.sans,
          fontWeight: '600',
          fontSize: 17,
        },
        sceneStyle: { backgroundColor: palette.canvas },
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: Fonts.sans,
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : palette.canvas,
          borderTopColor: palette.border,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={28} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={{ flex: 1 }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: palette.canvas }} />
          ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <IconSymbol name="house.fill" size={size ?? 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t('tabs.activity'),
          tabBarIcon: ({ color, size }) => <IconSymbol name="bolt.fill" size={size ?? 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="glass"
        options={{
          title: t('tabs.glass'),
          href: glassLab ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="square.grid.2x2.fill" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="slider.horizontal.3" size={size ?? 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
