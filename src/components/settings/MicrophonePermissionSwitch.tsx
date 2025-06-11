import { Pressable, View } from 'react-native';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';

export default function MicrophonePermissionSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      className="flex-row items-center justify-between bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 active:opacity-80"
      onPress={() => onCheckedChange(!checked)}
    >
      <View className="gap-2">
        <Text className="font-semibold text-neutral-800 dark:text-neutral-200">Microphone</Text>
        <Text className="text-neutral-800 dark:text-neutral-400">
          Allow app to access your microphone
        </Text>
      </View>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="w-[46px]" />
    </Pressable>
  );
}
