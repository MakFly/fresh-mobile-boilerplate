import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type DefaultValues, type FieldValues, type UseFormProps } from 'react-hook-form';
import type { z } from 'zod';

export function useAppForm<const Schema extends z.ZodType<FieldValues>>(
  schema: Schema,
  options?: Omit<UseFormProps<z.infer<Schema>>, 'resolver'> & {
    defaultValues?: DefaultValues<z.infer<Schema>>;
  }
) {
  type Values = z.infer<Schema>;

  return useForm<Values>({
    // Zod 4 + @hookform/resolvers: narrow to the v4 overload (avoids v3 branch + satisfies `ai` → zod/v4).
    resolver: zodResolver(schema as never),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    ...options,
  });
}
