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
import { FormField, signUpFormSchema, useAppForm } from '@/core/form';
import { useAppStore } from '@/core/store/app-store';
import {
  AuthFormShell,
  AuthPrimaryButton,
  AuthTextLink,
} from '@/features/auth/components/auth-form-shell';
import { useSignUp } from '@/features/auth/hooks/use-auth';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const lastAuthReturnTo = useAppStore((state) => state.lastAuthReturnTo);
  const returnTo = sanitizeAuthReturnTo(params.returnTo, lastAuthReturnTo);
  const signUp = useSignUp();
  const form = useAppForm(signUpFormSchema, {
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    signUp.mutate(
      { name: values.name.trim(), email: values.email.trim(), password: values.password },
      {
        onSuccess: () => {
          toast.success(t('signUp.successTitle'), {
            description: t('signUp.successDescription'),
          });
          router.replace(authReturnToHref(returnTo));
        },
        onError: (error) => {
          toast.error(t('signUp.errorTitle'), {
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
        eyebrow={t('signUp.eyebrow')}
        title={t('signUp.title')}
        description={t('signUp.description')}
        footer={
          <AuthTextLink
            label={t('signUp.alreadyHaveAccount')}
            onPress={() =>
              router.replace({
                pathname: '/(public)/sign-in',
                params: { returnTo: serializeAuthReturnTo(returnTo) },
              })
            }
          />
        }>
        <FormField control={form.control} name="name" label={t('auth.nameLabel')} placeholder={t('auth.namePlaceholder')} autoCapitalize="words" />
        <FormField control={form.control} name="email" label={t('auth.emailLabel')} placeholder={t('auth.emailPlaceholder')} keyboardType="email-address" />
        <FormField control={form.control} name="password" label={t('auth.passwordLabel')} placeholder={t('signUp.passwordPlaceholder')} secureTextEntry />
        {signUp.error ? <ThemedText style={{ color: '#D64545' }}>{signUp.error.message}</ThemedText> : null}
        <AuthPrimaryButton label={signUp.isPending ? t('signUp.creating') : t('signUp.createAccount')} disabled={signUp.isPending} onPress={onSubmit} />
      </AuthFormShell>
    </AppShell>
  );
}
