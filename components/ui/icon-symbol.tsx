// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'arrow.up': 'north',
  'house.fill': 'home',
  'sparkles': 'auto-awesome',
  'square.grid.2x2.fill': 'grid-view',
  'slider.horizontal.3': 'tune',
  'bolt.fill': 'bolt',
  'bell.fill': 'notifications',
  'person.fill': 'person',
  'lock.shield.fill': 'security',
  'arrow.up.right': 'open-in-new',
  'checkmark.circle.fill': 'check-circle',
  'bubble.left.and.bubble.right': 'forum',
  'bubble.left.fill': 'chat-bubble',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'plus': 'add',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
