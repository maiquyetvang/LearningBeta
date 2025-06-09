import { Pressable, View } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';

type Props = {
  title?: string;
  onBack?: () => void;
  handleBackPress?: () => void;
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
};

export const ScreenHeader = ({ title, onBack, slotLeft, slotRight }: Props) => {
  return (
    <View className="flex-row items-center px-2 bg-background h-13">
      <Pressable
        onPress={() => {
          if (onBack) {
            onBack();
            return;
          }
          router.back();
        }}
        className="p-2 size-11"
      >
        <ChevronLeft size={24} className="text-foreground" />
      </Pressable>
      {slotLeft && <View className="ml-2">{slotLeft}</View>}
      {title && <Text className="text-lg font-semibold text-foreground ml-2">{title}</Text>}
      {slotRight && <View className="ml-auto">{slotRight}</View>}
    </View>
  );
};
