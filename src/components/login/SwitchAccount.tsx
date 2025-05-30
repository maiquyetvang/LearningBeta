import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TouchableOpacity, View } from "react-native";
import { InputWithIcon } from "~/components/custom-ui/input-icon";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import ThemeIcon from "../Icon";
import { Lock } from "~/lib/icons/Lock";
import { Mail } from "~/lib/icons/Mail";
import { ArrowLeft, X } from "lucide-react-native";
import { AnimatedScreenWrapper } from "./AnimatedScreenWrapper";
import { ELoginScreen } from "~/app/login";

type SwitchAccountForm = {
  email: string;
  password: string;
};

export function SwitchAccount({
  onLogin,
  onRegister,
  onForgotPassword,
  onClose,
  onBack,
}: {
  onLogin?: (data: SwitchAccountForm) => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
  onClose?: () => void;
  onBack?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SwitchAccountForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SwitchAccountForm) => {
    setLoading(true);
    try {
      // Gọi API đăng nhập ở đây
      onLogin?.(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='gap-5'>
      {/* Header */}
      <View className='flex-row justify-between items-center'>
        <AnimatedScreenWrapper>
          <TouchableOpacity onPress={onBack}>
            <ThemeIcon Icon={ArrowLeft} />
          </TouchableOpacity>
        </AnimatedScreenWrapper>
        <AnimatedScreenWrapper>
          <H3 className='text-center'>Switch Account</H3>
        </AnimatedScreenWrapper>
        <AnimatedScreenWrapper>
          <TouchableOpacity onPress={onClose}>
            <ThemeIcon Icon={X} />
          </TouchableOpacity>
        </AnimatedScreenWrapper>
      </View>
      {/* Email */}
      <View className='gap-2'>
        <AnimatedScreenWrapper direction='up'>
          <Text className='font-semibold ml-3'>Email</Text>
        </AnimatedScreenWrapper>
        <Controller
          control={control}
          name='email'
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputWithIcon
              placeholder='Email'
              value={value}
              onChangeText={onChange}
              leftIcon={<Mail className='text-primary' size={20} />}
              autoCapitalize='none'
              keyboardType='email-address'
              editable={!loading}
              autoComplete='email'
            />
          )}
        />
        {errors.email && (
          <Text className='text-red-500 text-xs ml-3 mt-1'>
            {errors.email.message}
          </Text>
        )}
      </View>
      {/* Password */}
      <View className='gap-2'>
        <AnimatedScreenWrapper direction='up'>
          <Text className='font-semibold ml-3'>Password</Text>
        </AnimatedScreenWrapper>
        <Controller
          control={control}
          name='password'
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, value } }) => (
            <InputWithIcon
              placeholder='Enter your password'
              value={value}
              onChangeText={onChange}
              secureTextEntry
              leftIcon={<Lock className='text-primary' size={20} />}
              editable={!loading}
              autoComplete='off'
              textContentType='none'
              importantForAutofill='no'
            />
          )}
        />
        {errors.password && (
          <Text className='text-red-500 text-xs ml-3 mt-1'>
            {errors.password.message}
          </Text>
        )}
      </View>
      {/* Login Button */}
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>Login</Text>
      </Button>
      {/* Actions */}
      <AnimatedScreenWrapper>
        <View className='flex-row items-center justify-center gap-4'>
          <Pressable onPress={onRegister}>
            <Text className='text-primary'>Register</Text>
          </Pressable>
          <Pressable onPress={onForgotPassword}>
            <Text className='text-primary'>Forgot password?</Text>
          </Pressable>
        </View>
      </AnimatedScreenWrapper>
    </View>
  );
}
