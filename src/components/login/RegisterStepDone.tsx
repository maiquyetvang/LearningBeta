import { ArrowLeft, Check, X } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ELoginScreen } from '~/app/(auth)/login';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { H3 } from '~/components/ui/typography';
import ThemeIcon from '../Icon';

export function DoneStep({
  onNextStep,
  onClose,
  data,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
  data?: { email: string; verifyCode?: string };
}) {
  return (
    <View className="gap-5 items-center justify-center ">
      <View className="flex-row justify-between w-full">
        <TouchableOpacity className="opacity-0">
          <ThemeIcon Icon={ArrowLeft} />
        </TouchableOpacity>
        <H3 className="text-center">Register</H3>
        <TouchableOpacity onPress={() => onClose?.()}>
          <ThemeIcon Icon={X} />
        </TouchableOpacity>
      </View>
      <View className="bg-success w-24 justify-center items-center h-24 rounded-full p-3">
        <Check color={'white'} size={60} />
      </View>
      <H3>All done!</H3>
      <Text className="text-center">
        You’ve completed register Kindo account with email
        <Text className="text-primary"> {data?.email}</Text>
      </Text>

      <Button style={{ width: '100%' }} onPress={() => onNextStep?.(ELoginScreen.LOGIN)}>
        <Text>Back to Log in</Text>
      </Button>
    </View>
  );
}
