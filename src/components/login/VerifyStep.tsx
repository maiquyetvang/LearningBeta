import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ELoginScreen } from "~/src/app/login";
import { InputWithIcon } from "~/src/components/custom-ui/input-icon";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { H3, H4 } from "~/src/components/ui/typography";
import ThemeIcon from "../Icon";
import { Lock } from "~/src/lib/icons/Lock";
import { Mail } from "~/src/lib/icons/Mail";
import { ArrowLeft, X } from "lucide-react-native";

export function VerifyStep({
  onNextStep,
  onClose,
  data,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
  data?: { email: string; verifyCode?: string };
}) {
  const [counter, setCounter] = React.useState(5);
  const [canResend, setCanResend] = React.useState(false);

  React.useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [counter]);

  const handleResendCode = () => {
    if (!canResend) return;
    setCounter(59);
    setCanResend(false);
    // Logic to resend the verification code
  };

  const handleVerifyCode = () => {
    // Logic to verify the code
    onNextStep?.(ELoginScreen.DONE);
  };

  return (
    <View className='gap-5'>
      <View className='flex-row justify-between'>
        <TouchableOpacity onPress={() => onNextStep?.(ELoginScreen.REGISTER)}>
          <ThemeIcon Icon={ArrowLeft} />
        </TouchableOpacity>
        <H3 className='text-center'>Register</H3>
        <TouchableOpacity onPress={() => onClose?.()}>
          <ThemeIcon Icon={X} />
        </TouchableOpacity>
      </View>
      <H4 className='font-semibold '>Verification Code</H4>
      <Text className=''>
        A 6-digit code has been sent to{" "}
        <Text className='text-primary'>email@gmail.com</Text>.{"\n"}
        Please enter this code to verify your email.
      </Text>
      <InputWithIcon placeholder='Enter the verification code' />

      <TouchableOpacity
        className='flex-row mx-auto justify-between items-center'
        onPress={handleResendCode}
      >
        <Text className={canResend ? "text-primary" : "text-gray-400"}>
          {canResend ? "Resend Code" : `Resend Code in ${counter}s`}
        </Text>
      </TouchableOpacity>

      <Button onPress={handleVerifyCode}>
        <Text>Verify</Text>
      </Button>
      <Button
        onPress={handleResendCode}
        className='flex-row items-center justify-center'
        variant={"neutral"}
      >
        <Text>Back</Text>
      </Button>
    </View>
  );
}
