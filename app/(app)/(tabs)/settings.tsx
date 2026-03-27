import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { toast } from 'sonner-native';

import { AppShell } from '@/components/app/app-shell';
import { GlassSurface } from '@/components/glass/glass-surface';
import { AppImage } from '@/components/ui/app-image';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { serializeAuthReturnTo } from '@/core/auth/return-to';
import { authenticateWithBiometric, getSupportedBiometricLabel, isBiometricAvailable } from '@/core/auth/biometric';
import { i18n } from '@/core/i18n';
import { FormField, profileNameFormSchema, useAppForm } from '@/core/form';
import { useNotifications } from '@/core/notifications';
import { AppThemePreference, useAppStore } from '@/core/store/app-store';
import {
  AuthPrimaryButton,
} from '@/features/auth/components/auth-form-shell';
import {
  useAuthSession,
  useCurrentUser,
  useSignOut,
  useUpdateProfile,
} from '@/features/auth/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useImagePicker } from '@/hooks/use-image-picker';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isLoading } = useAuthSession();
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const signOut = useSignOut();
  const form = useAppForm(profileNameFormSchema, {
    defaultValues: { name: user?.name ?? '' },
  });
  const biometricPref = useAppStore((s) => s.biometricPromptEnabled);
  const setBiometricPref = useAppStore((s) => s.setBiometricPromptEnabled);
  const appLanguage = useAppStore((s) => s.appLanguage);
  const setAppLanguage = useAppStore((s) => s.setAppLanguage);
  const themePreference = useAppStore((s) => s.themePreference);
  const setThemePreference = useAppStore((s) => s.setThemePreference);
  const { requestPermission, token, isGranted } = useNotifications();
  const { busy, pickFromLibrary } = useImagePicker();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [biometricLabel, setBiometricLabel] = useState('Biometric');
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  useEffect(() => {
    void getSupportedBiometricLabel().then(setBiometricLabel);
  }, []);

  useEffect(() => {
    form.reset({ name: user?.name ?? '' });
  }, [user?.name, form]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    const returnTo = serializeAuthReturnTo({ pathname: '/(app)/(tabs)/settings' });
    return <Redirect href={{ pathname: '/(public)/sign-in', params: { returnTo } }} />;
  }

  const onSubmit = form.handleSubmit((values) => {
    updateProfile.mutate(
      { name: values.name.trim() },
      {
        onSuccess: () => {
          toast.success(t('settings.profileUpdatedTitle'), {
            description: t('settings.profileUpdatedDescription'),
          });
        },
        onError: (error) => {
          toast.error(t('settings.profileUpdateFailedTitle'), {
            description: error.message,
          });
        },
      }
    );
  });

  return (
    <AppShell scroll safeAreaEdges={['left', 'right']} topInset={8}>
      <GlassSurface>
        <ThemedText type="caption">{t('settings.sessionCaption')}</ThemedText>
        <ThemedText type="title">{t('settings.title')}</ThemedText>
        <ThemedText>{user?.email}</ThemedText>
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.profileSection')}</ThemedText>
        <FormField control={form.control} name="name" label={t('settings.displayName')} placeholder={t('settings.displayNamePlaceholder')} autoCapitalize="words" />
        {updateProfile.error ? (
          <ThemedText style={{ color: '#D64545' }}>{updateProfile.error.message}</ThemedText>
        ) : null}
        {updateProfile.isSuccess ? (
          <ThemedText>{t('settings.profileUpdatedInline')}</ThemedText>
        ) : null}
        <AuthPrimaryButton
          label={updateProfile.isPending ? t('settings.saving') : t('settings.saveProfile')}
          disabled={updateProfile.isPending}
          onPress={onSubmit}
        />
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.avatar')}</ThemedText>
        <View style={styles.avatarRow}>
          {avatarUri ? (
            <AppImage source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          <AuthPrimaryButton
            label={busy ? t('settings.opening') : t('settings.pickPhoto')}
            disabled={busy}
            onPress={async () => {
              const picked = await pickFromLibrary();
              if (picked?.uri) {
                setAvatarUri(picked.uri);
              }
            }}
          />
        </View>
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.appearance')}</ThemedText>
        <ThemedText style={styles.muted}>{t('settings.appearanceHint')}</ThemedText>
        <View style={styles.languageRow}>
          {(
            [
              ['system', t('settings.themeSystem')],
              ['light', t('settings.themeLight')],
              ['dark', t('settings.themeDark')],
            ] as const satisfies readonly [AppThemePreference, string][]
          ).map(([preference, label]) => {
            const selected = themePreference === preference;

            return (
              <Pressable
                key={preference}
                accessibilityRole="button"
                onPress={() => setThemePreference(preference)}
                style={[
                  styles.languageButton,
                  {
                    backgroundColor: selected ? palette.overlay : 'transparent',
                    borderColor: selected ? palette.tint : palette.borderStrong,
                  },
                ]}>
                <ThemedText type="defaultSemiBold">{label}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.language')}</ThemedText>
        <ThemedText style={styles.muted}>{t('settings.languageHint')}</ThemedText>
        <View style={styles.languageRow}>
          {(['fr', 'en'] as const).map((language) => {
            const selected = (appLanguage ?? i18n.language) === language;
            return (
              <Pressable
                key={language}
                accessibilityRole="button"
                onPress={() => {
                  setAppLanguage(language);
                  void i18n.changeLanguage(language);
                }}
                style={[
                  styles.languageButton,
                  {
                    backgroundColor: selected ? palette.overlay : 'transparent',
                    borderColor: selected ? palette.tint : palette.borderStrong,
                  },
                ]}>
                <ThemedText type="defaultSemiBold">
                  {language === 'fr' ? t('settings.languageFrench') : t('settings.languageEnglish')}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>

      <GlassSurface>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText type="subtitle">{t('settings.biometric')}</ThemedText>
            <ThemedText style={styles.muted}>{t('settings.biometricHint')}</ThemedText>
          </View>
          <Switch value={biometricPref} onValueChange={setBiometricPref} accessibilityLabel={t('settings.biometric')} />
        </View>
        <AuthPrimaryButton
          label={`${t('settings.testBiometric')} (${biometricLabel})`}
          onPress={async () => {
            const available = await isBiometricAvailable();
            if (!available) {
              toast.error(t('settings.biometricUnavailableTitle'), { description: t('settings.biometricUnavailableDescription') });
              return;
            }
            const result = await authenticateWithBiometric('Unlock starter settings');
            if (result.success) {
              toast.success(t('settings.biometricSuccessTitle'));
            } else {
              toast.error(t('settings.biometricFailedTitle'), {
                description: result.warning ?? String(result.error),
              });
            }
          }}
        />
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.push')}</ThemedText>
        <ThemedText style={styles.muted}>{t('settings.pushHint')}</ThemedText>
        <Pressable
          onPress={async () => {
            const ok = await requestPermission();
            if (ok) {
              toast.success(t('settings.notificationsEnabledTitle'));
            } else {
              toast.error(t('settings.permissionDeniedTitle'));
            }
          }}
          style={styles.linkButton}>
          <ThemedText type="link">{t('settings.registerPush')}</ThemedText>
        </Pressable>
        <ThemedText type="caption" style={styles.muted}>
          {isGranted ? t('settings.tokenValue', { token: token ?? 'pending' }) : t('settings.notGranted')}
        </ThemedText>
      </GlassSurface>

      <GlassSurface>
        <ThemedText type="subtitle">{t('settings.dangerZone')}</ThemedText>
        <View style={styles.actions}>
          <AuthPrimaryButton
            label={signOut.isPending ? t('settings.signingOut') : t('settings.signOut')}
            disabled={signOut.isPending}
            onPress={() =>
              signOut.mutate(undefined, {
                onSuccess: () => {
                  toast(t('settings.signedOutTitle'), {
                    description: t('settings.signedOutDescription'),
                  });
                  router.replace('/(onboarding)');
                },
              })
            }
          />
        </View>
      </GlassSurface>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
  },
  avatarRow: {
    gap: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(127,127,127,0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  muted: {
    opacity: 0.8,
    fontSize: 13,
  },
  linkButton: {
    paddingVertical: 8,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  languageButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
