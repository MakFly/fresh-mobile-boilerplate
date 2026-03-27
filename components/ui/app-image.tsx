import { Image, type ImageContentFit, type ImageProps } from 'expo-image';
import { type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const blurhashLight = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';
const blurhashDark = 'L6BHsfNnV[s0#9VXM{s$~6NGWBj[';

export type AppImageProps = Omit<ImageProps, 'placeholder'> & {
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
};

export function AppImage({ containerStyle, style, contentFit = 'cover', ...rest }: AppImageProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Image
      contentFit={contentFit}
      placeholder={{ blurhash: colorScheme === 'dark' ? blurhashDark : blurhashLight }}
      recyclingKey={typeof rest.source === 'object' && rest.source && 'uri' in rest.source ? rest.source.uri : undefined}
      style={[{ backgroundColor: palette.canvas }, style]}
      {...rest}
    />
  );
}
