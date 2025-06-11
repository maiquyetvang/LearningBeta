import { ArrowLeft, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';
import { ELoginScreen } from '~/app/(auth)/login';
import { InputWithIcon } from '~/components/custom-ui/input-icon';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { H3 } from '~/components/ui/typography';
import { Lock } from '~/lib/icons/Lock';
import { Mail } from '~/lib/icons/Mail';
import { useSystem } from '~/lib/powersync';
import { PasswordRules, checkPasswordRules } from '../custom-ui/password-rule';
import ThemeIcon from '../Icon';
import { AnimatedScreenWrapper } from './AnimatedScreenWrapper';

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterStep({
  onNextStep,
  onRegister,
  onClose,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onRegister?: (data: { email: string; verifyCode?: string }) => void;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { supabase } = useSystem();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      console.log({ data });
      const { email, password } = data;
      await supabase.register(email, password);
      onNextStep?.(ELoginScreen.LOGIN);
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [onClose, reset]);

  return (
    <View className="gap-5">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AnimatedScreenWrapper>
          <TouchableOpacity onPress={() => onNextStep?.(ELoginScreen.LOGIN)}>
            <ThemeIcon Icon={ArrowLeft} />
          </TouchableOpacity>
        </AnimatedScreenWrapper>
        <AnimatedScreenWrapper>
          <H3 className="text-center">Register</H3>
        </AnimatedScreenWrapper>
        <AnimatedScreenWrapper>
          <TouchableOpacity onPress={() => onClose?.()}>
            <ThemeIcon Icon={X} />
          </TouchableOpacity>
        </AnimatedScreenWrapper>
      </View>
      <View className="gap-2">
        <AnimatedScreenWrapper direction="up">
          <Text className="font-semibold ml-3">Email</Text>
        </AnimatedScreenWrapper>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputWithIcon
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              leftIcon={<Mail className="text-primary" size={20} />}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              autoComplete="email"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs ml-3 mt-1">{errors.email.message}</Text>
        )}
      </View>
      <View className="gap-2">
        <AnimatedScreenWrapper direction="up">
          <Text className="font-semibold ml-3">Password</Text>
        </AnimatedScreenWrapper>
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            validate: (value) => {
              const rules = checkPasswordRules(value);
              if (!rules.allPassed) return '';
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <InputWithIcon
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                leftIcon={<Lock className="text-primary" size={20} />}
                editable={!loading}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
              />
              <AnimatedScreenWrapper direction="down">
                {!checkPasswordRules(value).allPassed && <PasswordRules password={value} />}
              </AnimatedScreenWrapper>
            </>
          )}
        />
        {!!errors.password?.message && (
          <Text className="text-red-500 text-xs ml-3 mt-1">{errors.password.message}</Text>
        )}
      </View>
      <AnimatedScreenWrapper className="gap-2" direction="down">
        <Text className="font-semibold ml-3">Confirm Password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirm password is required',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          }}
          render={({ field: { onChange, value } }) => (
            <InputWithIcon
              placeholder="Re-enter your password"
              value={value}
              onChangeText={onChange}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              secureTextEntry
              leftIcon={<Lock className="text-primary" size={20} />}
              editable={!loading}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-xs ml-3 mt-1">{errors.confirmPassword.message}</Text>
        )}
      </AnimatedScreenWrapper>
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>Register</Text>
      </Button>
      <AnimatedScreenWrapper>
        <Pressable
          onPress={() => onNextStep?.(ELoginScreen.LOGIN)}
          className="flex-row items-center justify-center"
        >
          <Text className="text-primary">Already have an account?</Text>
        </Pressable>
      </AnimatedScreenWrapper>
    </View>
  );
}
