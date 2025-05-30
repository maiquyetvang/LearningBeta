import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function SettingSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <View className='gap-3'>
      <Text className='font-semibold text-lg'>{title}</Text>
      {children}
    </View>
  );
}
