import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

import { AuthTokenSync } from '@/components/app/auth-token-sync';
import { OfflineBanner } from '@/components/app/offline-banner';
import { UpdateSync } from '@/components/app/update-sync';
import { Colors } from '@/constants/theme';
import { i18n, resolveDeviceLanguage } from '@/core/i18n';
import { createAppQueryClient } from '@/core/query/client';
import { registerQueryOnlineListener } from '@/core/query/online';
import { useAppStore } from '@/core/store/app-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

function AppLanguageSync() {
  const appLanguage = useAppStore((state) => state.appLanguage);

  useEffect(() => {
    const nextLanguage = appLanguage ?? resolveDeviceLanguage();
    if (i18n.language !== nextLanguage) {
      void i18n.changeLanguage(nextLanguage);
    }
  }, [appLanguage]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createAppQueryClient());
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  useEffect(() => {
    registerQueryOnlineListener();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <AuthTokenSync />
          <I18nextProvider i18n={i18n}>
            <AppLanguageSync />
            <View style={{ flex: 1 }}>
              <OfflineBanner />
              <UpdateSync />
              {children}
            </View>
            <Toaster
              theme={colorScheme}
              richColors
              visibleToasts={1}
              offset={56}
              position="top-center"
              toastOptions={{
                style: {
                  backgroundColor: palette.cardStrong,
                  borderColor: palette.borderStrong,
                  borderWidth: 1,
                },
                titleStyle: {
                  color: palette.text,
                },
                descriptionStyle: {
                  color: palette.textMuted,
                },
              }}
            />
          </I18nextProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
