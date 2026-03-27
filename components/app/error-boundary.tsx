import { PropsWithChildren, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ErrorBoundaryLib from 'react-native-error-boundary';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { logger } from '@/core/logger';
import { useColorScheme } from '@/hooks/use-color-scheme';

function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <ThemedText type="title">Something broke</ThemedText>
      <ThemedText style={{ color: palette.textMuted }}>{error.message}</ThemedText>
      <Pressable
        onPress={resetError}
        style={[styles.button, { backgroundColor: palette.tint }]}
        accessibilityRole="button">
        <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
          Try again
        </ThemedText>
      </Pressable>
    </View>
  );
}

export function AppErrorBoundary({ children }: PropsWithChildren) {
  const onError = useCallback((error: Error, stackTrace: string) => {
    logger.error('Uncaught render error', { message: error.message, stack: stackTrace });
  }, []);

  return (
    <ErrorBoundaryLib FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ErrorBoundaryLib>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
});
