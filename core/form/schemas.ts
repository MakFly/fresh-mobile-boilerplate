import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.string().min(1, 'Email required').email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, 'Email required').email('Invalid email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const profileNameFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export type ProfileNameFormValues = z.infer<typeof profileNameFormSchema>;
