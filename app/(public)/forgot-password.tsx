import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { AppShell } from '@/components/app/app-shell';
import { sanitizeAuthReturnTo, serializeAuthReturnTo } from '@/core/auth/return-to';
import { ThemedText } from '@/components/themed-text';
import { FormField, forgotPasswordFormSchema, useAppForm } from '@/core/form';
import { useAppStore } from '@/core/store/app-store';
import {
  AuthFormShell,
  AuthPrimaryButton,
  AuthTextLink,
} from '@/features/auth/components/auth-form-shell';
import { useForgotPassword } from '@/features/auth/hooks/use-auth';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const returnTo = sanitizeAuthReturnTo(params.returnTo, lastAuthReturnTo);
  const forgotPassword = useForgotPassword();
  const [message, setMessage] = useState<string | null>(null);
  const form = useAppForm(forgotPasswordFormSchema, {
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    forgotPassword.mutate(
      { email: values.email.trim() },
      {
        onSuccess: () => {
          setMessage(t('forgotPassword.successMessage'));
          toast.success(t('forgotPassword.successTitle'), {
            description: t('forgotPassword.successDescription'),
          });
        },
        onError: (error) => {
          toast.error(t('forgotPassword.errorTitle'), {
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
        eyebrow={t('forgotPassword.eyebrow')}
        title={t('forgotPassword.title')}
        description={t('forgotPassword.description')}
        footer={
          <AuthTextLink
            label={t('forgotPassword.backToSignIn')}
            onPress={() =>
              router.replace({
                pathname: '/(public)/sign-in',
                params: { returnTo: serializeAuthReturnTo(returnTo) },
              })
            }
          />
        }>
        <FormField control={form.control} name="email" label={t('auth.emailLabel')} placeholder={t('forgotPassword.emailPlaceholder')} keyboardType="email-address" />
        {forgotPassword.error ? (
          <ThemedText style={{ color: '#D64545' }}>{forgotPassword.error.message}</ThemedText>
        ) : null}
        {message ? <ThemedText>{message}</ThemedText> : null}
        <AuthPrimaryButton
          label={forgotPassword.isPending ? t('forgotPassword.checking') : t('forgotPassword.submit')}
          disabled={forgotPassword.isPending}
          onPress={onSubmit}
        />
      </AuthFormShell>
    </AppShell>
  );
}
