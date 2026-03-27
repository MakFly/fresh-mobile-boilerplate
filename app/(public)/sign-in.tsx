import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { AppShell } from '@/components/app/app-shell';
import {
  authReturnToHref,
  sanitizeAuthReturnTo,
  serializeAuthReturnTo,
} from '@/core/auth/return-to';
import { ThemedText } from '@/components/themed-text';
import { FormField, signInFormSchema, useAppForm } from '@/core/form';
import { logger } from '@/core/logger';
import { useAppStore } from '@/core/store/app-store';
import {
  AuthFormShell,
  AuthPrimaryButton,
  AuthTextLink,
} from '@/features/auth/components/auth-form-shell';
import { useSignIn } from '@/features/auth/hooks/use-auth';

export default function SignInScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const returnTo = sanitizeAuthReturnTo(params.returnTo, lastAuthReturnTo);
  const signIn = useSignIn();
  const form = useAppForm(signInFormSchema, {
    defaultValues: { email: 'demo@fresh.app', password: 'password123' },
  });

  const onSubmit = form.handleSubmit((values) => {
    signIn.mutate(
      { email: values.email.trim(), password: values.password },
      {
        onSuccess: () => {
          logger.info('Sign-in succeeded', { email: values.email });
          toast.success(t('signIn.successTitle'), {
            description: t('signIn.successDescription'),
          });
          router.replace(authReturnToHref(returnTo));
        },
        onError: (error) => {
          logger.warn('Sign-in failed', { email: values.email, message: error.message });
          toast.error(t('signIn.errorTitle'), {
            description: error.message,
          });
        },
      }
    );
  });

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    router.replace('/');
  };

  return (
    <AppShell keyboard scroll>
      <AuthFormShell
        onBack={handleBack}
        backLabel={t('common.back')}
        eyebrow={t('signIn.eyebrow')}
        title={t('signIn.title')}
        description={t('signIn.description')}
        footer={
          <>
            <ThemedText style={{ fontSize: 14 }}>
              {t('signIn.demoAccount')}
            </ThemedText>
            <AuthTextLink
              label={t('signIn.createAccount')}
              onPress={() =>
                router.replace({
                  pathname: '/(public)/sign-up',
                  params: { returnTo: serializeAuthReturnTo(returnTo) },
                })
              }
            />
            <AuthTextLink
              label={t('signIn.forgotPassword')}
              onPress={() =>
                router.replace({
                  pathname: '/(public)/forgot-password',
                  params: { returnTo: serializeAuthReturnTo(returnTo) },
                })
              }
            />
          </>
        }>
        <FormField control={form.control} name="email" label={t('auth.emailLabel')} placeholder={t('auth.emailPlaceholder')} keyboardType="email-address" />
        <FormField control={form.control} name="password" label={t('auth.passwordLabel')} placeholder={t('auth.passwordPlaceholder')} secureTextEntry />
        {signIn.error ? <ThemedText style={{ color: '#D64545' }}>{signIn.error.message}</ThemedText> : null}
        <AuthPrimaryButton
          label={signIn.isPending ? t('signIn.signingIn') : t('signIn.signIn')}
          disabled={signIn.isPending}
          onPress={onSubmit}
        />
      </AuthFormShell>
    </AppShell>
  );
}
