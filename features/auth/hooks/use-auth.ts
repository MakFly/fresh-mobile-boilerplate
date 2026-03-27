import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { setApiAuthToken } from '@/core/api/auth-token';
import { authRepository } from '@/core/auth/repository';
import {
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
  UpdateProfileInput,
} from '@/core/auth/types';
import { queryKeys } from '@/core/query/keys';

export function useAuthSession() {
  return useQuery({
    queryKey: queryKeys.authSession,
    queryFn: () => authRepository.restoreSession(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useCurrentUser() {
  const { data } = useAuthSession();
  return data?.user ?? null;
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignInInput) => authRepository.signIn(input),
    onSuccess: (session) => {
      setApiAuthToken(session.token);
      queryClient.setQueryData(queryKeys.authSession, session);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignUpInput) => authRepository.signUp(input),
    onSuccess: (session) => {
      setApiAuthToken(session.token);
      queryClient.setQueryData(queryKeys.authSession, session);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authRepository.requestPasswordReset(input),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authRepository.signOut(),
    onSuccess: () => {
      setApiAuthToken(null);
      queryClient.setQueryData(queryKeys.authSession, null);
      queryClient.removeQueries({ queryKey: queryKeys.dashboardSummary });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authRepository.updateProfile(input),
    onSuccess: (session) => {
      setApiAuthToken(session.token);
      queryClient.setQueryData(queryKeys.authSession, session);
    },
  });
}
