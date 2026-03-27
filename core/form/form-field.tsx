import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { AuthField } from '@/features/auth/components/auth-form-shell';

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, unknown, TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
};

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <AuthField
          label={label}
          value={typeof value === 'string' ? value : ''}
          onChangeText={onChange}
          onBlur={onBlur}
          errorMessage={error?.message}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          placeholder={placeholder}
        />
      )}
    />
  );
}
