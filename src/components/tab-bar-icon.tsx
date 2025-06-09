import { LucideProps, icons } from 'lucide-react-native';
import { StyleProp, ViewStyle } from 'react-native';

export function TabBarIcon({
  style,
  focused,
  name,
  ...rest
}: LucideProps & {
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  name: keyof typeof icons;
}) {
  // eslint-disable-next-line import/namespace
  const LucideIcon = icons[name as keyof typeof icons];
  return <LucideIcon style={[style]} {...rest} />;
}
