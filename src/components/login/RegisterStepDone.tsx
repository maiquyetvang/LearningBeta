import { ArrowLeft, Check, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ELoginScreen } from "~/src/app/login";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { H3 } from "~/src/components/ui/typography";
import ThemeIcon from "../Icon";

export function DoneStep({
  onNextStep,
  onClose,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
}) {
  return (
    <View className='gap-5 items-center justify-center '>
      <View className='flex-row justify-between w-full'>
        <TouchableOpacity className='opacity-0'>
          <ThemeIcon Icon={ArrowLeft} />
        </TouchableOpacity>
        <H3 className='text-center'>Register</H3>
        <TouchableOpacity onPress={() => onClose?.()}>
          <ThemeIcon Icon={X} />
        </TouchableOpacity>
      </View>
      <View className='bg-success w-24 justify-center items-center h-24 rounded-full p-3'>
        <Check color={"white"} size={60} />
      </View>
      <H3>All done!</H3>
      <Text className='text-center'>
        You’ve completed register Kindo account with email{" "}
        <Text className='text-primary'>email@gmail.com</Text>
      </Text>

      <Button
        style={{ width: "100%" }}
        onPress={() => onNextStep?.(ELoginScreen.LOGIN)}
      >
        <Text>Back to Log in</Text>
      </Button>
    </View>
  );
}
