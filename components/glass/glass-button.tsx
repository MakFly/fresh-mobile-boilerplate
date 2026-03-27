import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: string;
};

export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  icon,
}: GlassButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? palette.text : palette.overlay,
          borderColor: primary ? palette.text : palette.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}>
      <View style={styles.labelWrap}>
        {icon ? <IconSymbol color={primary ? palette.background : palette.text} name={icon as any} size={16} /> : null}
        <ThemedText
          type="defaultSemiBold"
          style={{ color: primary ? palette.background : palette.text }}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
