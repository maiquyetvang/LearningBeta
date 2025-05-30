import { ArrowLeft, X } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { ELoginScreen } from "~/app/login";
import { InputWithIcon } from "~/components/custom-ui/input-icon";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H3, H4 } from "~/components/ui/typography";
import ThemeIcon from "../Icon";

type VerifyFormData = {
  verificationCode: string;
};

export function VerifyStep({
  onNextStep,
  onClose,
  data,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
  data?: { email: string; verifyCode?: string };
}) {
  const { email, verifyCode } = data || {};
  const [counter, setCounter] = React.useState(5);
  const [canResend, setCanResend] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    defaultValues: {
      verificationCode: "",
    },
  });

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

  const onSubmit = (formData: VerifyFormData) => {
    // So sánh với verifyCode được truyền vào
    if (formData.verificationCode === verifyCode) {
      setVerifyError(null);
      onNextStep?.(ELoginScreen.DONE);
    } else {
      setVerifyError("Invalid verification code. Please try again.");
    }
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
        <Text className='text-primary'>{email || "your email"}</Text>.{"\n"}
        Please enter this code to verify your email.
      </Text>

      <Controller
        control={control}
        name='verificationCode'
        rules={{
          required: "Verification code is required",
          minLength: {
            value: 6,
            message: "Code must be 6 digits",
          },
          maxLength: {
            value: 6,
            message: "Code must be 6 digits",
          },
          pattern: {
            value: /^[0-9]+$/,
            message: "Code must contain only numbers",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <InputWithIcon
              value={value}
              onChangeText={onChange}
              placeholder='Enter the verification code'
              keyboardType='number-pad'
              maxLength={6}
            />
            {errors.verificationCode && (
              <Text className='text-red-500 text-xs mt-1 ml-3'>
                {errors.verificationCode.message}
              </Text>
            )}
            {verifyError && (
              <Text className='text-red-500 text-xs mt-1 ml-3'>
                {verifyError}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className='flex-row mx-auto justify-between items-center'
        onPress={handleResendCode}
        disabled={!canResend}
      >
        <Text className={canResend ? "text-primary" : "text-gray-400"}>
          {canResend ? "Resend Code" : `Resend Code in ${counter}s`}
        </Text>
      </TouchableOpacity>

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Verify</Text>
      </Button>
      <Button
        onPress={() => onNextStep?.(ELoginScreen.REGISTER)}
        className='flex-row items-center justify-center'
        variant={"neutral"}
      >
        <Text>Back</Text>
      </Button>
    </View>
  );
}
