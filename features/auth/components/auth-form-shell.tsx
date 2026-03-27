import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { GlassSurface } from '@/components/glass/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  errorMessage?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  placeholder: string;
};

type AuthFormShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}>;

export function AuthFormShell({
  eyebrow,
  title,
  description,
  footer,
  onBack,
  backLabel,
  children,
}: AuthFormShellProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <GlassSurface style={styles.card}>
      {onBack ? (
        <Pressable onPress={onBack} accessibilityRole="button" style={styles.backButton}>
          <IconSymbol name="chevron.left" size={18} color={palette.text} />
          <ThemedText type="defaultSemiBold">{backLabel}</ThemedText>
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <ThemedText type="caption" style={{ color: palette.textSoft }}>
          {eyebrow}
        </ThemedText>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={{ color: palette.textMuted }}>{description}</ThemedText>
      </View>
      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </GlassSurface>
  );
}

export function AuthField({
  label,
  value,
  onChangeText,
  onBlur,
  errorMessage,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  placeholder,
}: FieldProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={palette.textSoft}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.card,
            borderColor: hasError ? '#D64545' : palette.borderStrong,
          },
        ]}
      />
      {errorMessage ? (
        <ThemedText style={{ color: '#D64545', fontSize: 13 }}>{errorMessage}</ThemedText>
      ) : null}
    </View>
  );
}

export function AuthPrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        {
          backgroundColor: disabled ? palette.borderStrong : palette.tint,
          opacity: disabled ? 0.6 : 1,
        },
      ]}>
      <ThemedText type="defaultSemiBold" style={styles.primaryLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function AuthTextLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Pressable onPress={onPress}>
      <ThemedText type="link" style={{ color: palette.tint }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 18,
    width: '100%',
    alignSelf: 'stretch',
  },
  copy: {
    gap: 10,
  },
  backButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    gap: 10,
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 4,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
});
