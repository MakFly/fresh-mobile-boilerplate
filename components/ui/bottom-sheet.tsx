import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export { BottomSheetModalProvider };

const sheetStyles = StyleSheet.create({
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },
});

function GlassBackdrop(props: BottomSheetBackdropProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={1}
      style={[props.style, StyleSheet.absoluteFill]}>
      <View style={StyleSheet.absoluteFill}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={48} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={sheetStyles.blurFill} />
        ) : (
          <View style={[sheetStyles.blurFill, { backgroundColor: `${palette.background}CC` }]} />
        )}
      </View>
    </BottomSheetBackdrop>
  );
}

export type AppBottomSheetModalProps = Omit<BottomSheetModalProps, 'backdropComponent'> & {
  backdropComponent?: BottomSheetModalProps['backdropComponent'];
};

export function AppBottomSheetModal({ backdropComponent, backgroundStyle, handleIndicatorStyle, ...rest }: AppBottomSheetModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => {
      if (backdropComponent) {
        const Backdrop = backdropComponent;
        return <Backdrop {...backdropProps} />;
      }
      return <GlassBackdrop {...backdropProps} />;
    },
    [backdropComponent]
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      backgroundStyle={[{ backgroundColor: palette.cardStrong }, backgroundStyle]}
      handleIndicatorStyle={[{ backgroundColor: palette.textMuted }, handleIndicatorStyle]}
      {...rest}
    />
  );
}
