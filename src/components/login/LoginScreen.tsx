import { Lock, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, View } from "react-native";
import { authApi } from "~/src/api/auth.local";
import { ELoginScreen } from "~/src/app/login";
import { InputWithIcon } from "~/src/components/custom-ui/input-icon";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { H3 } from "~/src/components/ui/typography";
import { Checkbox } from "../ui/checkbox";
import { useAuthStore } from "~/src/stores/auth.store";
import { User } from "~/src/types/user.type";
import { router } from "expo-router";
import { AnimatedScreenWrapper } from "./AnimatedScreenWrapper";

export type LoginForm = {
  email: string;
  password: string;
  stayLogin: boolean;
  remember: boolean;
};

export function LoginStep({
  onNextStep,
  onClose,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    defaultValues: {
      email: user?.email || "",
      password: "",
      remember: user?.remember || false,
      stayLogin: true,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await authApi.login(data);
      login({
        email: result.email,
        remember: data.remember,
        stayLogin: data.stayLogin,
      } as User);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Login Failed", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      reset();
    };
  }, [onClose]);
  return (
    <View className='gap-5'>
      <AnimatedScreenWrapper>
        <H3 className='text-center'>Login</H3>
      </AnimatedScreenWrapper>
      <Controller
        control={control}
        name='email'
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <View>
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
            {errors.email && (
              <Text className='text-red-500 text-xs mt-1 ml-3'>
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name='password'
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <View>
            <InputWithIcon
              placeholder='Password'
              value={value}
              onChangeText={onChange}
              secureTextEntry
              editable={!loading}
              leftIcon={<Lock className='text-primary' size={20} />}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
            {errors.password && (
              <Text className='text-red-500 text-xs mt-1 ml-3'>
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
      />
      <AnimatedScreenWrapper
        className='flex-row gap-5 items-center'
        direction='up'
      >
        <Controller
          control={control}
          name='stayLogin'
          render={({ field: { value, onChange } }) => (
            <Pressable
              className='flex-row items-center'
              onPress={() => onChange(!value)}
              disabled={loading}
            >
              <Checkbox
                checked={value}
                onCheckedChange={onChange}
                disabled={loading}
              />
              <Text className='ml-2'>Stay Signed in</Text>
            </Pressable>
          )}
        />
        <Controller
          control={control}
          name='remember'
          render={({ field: { value, onChange } }) => (
            <Pressable
              className='flex-row items-center'
              onPress={() => onChange(!value)}
              disabled={loading}
            >
              <Checkbox
                checked={value}
                onCheckedChange={onChange}
                disabled={loading}
              />
              <Text className='ml-2'>Remember User ID</Text>
            </Pressable>
          )}
        />
      </AnimatedScreenWrapper>
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>Login</Text>
      </Button>
      <AnimatedScreenWrapper className='gap-5'>
        <Pressable
          onPress={() => {
            // closeBottomSheet();
          }}
          disabled={loading}
          className='flex-row items-center justify-center'
        >
          <Text className='text-primary'>Forgot your ID or Password?</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onNextStep?.(ELoginScreen.REGISTER);
          }}
          disabled={loading}
          className='flex-row items-center justify-center'
        >
          <Text className='text-primary'>Register</Text>
        </Pressable>
      </AnimatedScreenWrapper>
    </View>
  );
}
