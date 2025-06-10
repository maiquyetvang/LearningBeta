import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import HeaderWithAction from "~/components/common/HeaderWithAction";
import { InputWithIcon } from "~/components/custom-ui/input-icon";
import {
  checkPasswordRules,
  PasswordRules,
} from "~/components/custom-ui/password-rule";
import { Text } from "~/components/ui/text";
import { Lock } from "~/lib/icons/Lock";
import { useSystem } from "~/lib/powersync";

type FormValues = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { supabase } = useSystem();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await supabase.changePassword(data.currentPassword, data.password);
      toast.success("Password changed successfully");
      handleBack();
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = "An unexpected error occurred";
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  });
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(protected)/(_tabs)/settings");
    }
  };
  React.useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [watch("currentPassword"), watch("password"), watch("confirmPassword")]);
  return (
    <SafeAreaView className='flex-1 ' style={{ paddingTop: insets.top }}>
      <View className='flex-1 px-5'>
        <HeaderWithAction
          title='Change Password'
          actionLabel='Save'
          onBack={handleBack}
          onAction={handleSave}
          disableAction={loading}
        />
        {/* Form */}
        <View className='gap-4'>
          {/* Current Password */}
          <View>
            <Text className='ml-3 mb-1 font-medium'>
              Current Password <Text className='text-error'>*</Text>
            </Text>
            <Controller
              control={control}
              name='currentPassword'
              rules={{
                required: "Current password is required",
              }}
              render={({ field: { onChange, value } }) => (
                <InputWithIcon
                  placeholder='Enter your current password'
                  value={value}
                  onChangeText={onChange}
                  // autoComplete='off'
                  // textContentType='none'
                  // importantForAutofill='no'
                  secureTextEntry
                  leftIcon={<Lock className='text-primary' size={20} />}
                  editable={!loading}
                />
              )}
            />
            {errors.currentPassword && (
              <Text className='text-red-500 text-xs ml-3 mt-1'>
                {errors.currentPassword.message}
              </Text>
            )}
          </View>
          {/* New Password */}
          <View className='gap-1'>
            <Text className='ml-3 mb-1 font-medium'>
              New Password <Text className='text-error'>*</Text>
            </Text>
            <Controller
              control={control}
              name='password'
              rules={{
                required: "New password is required",
                validate: (value) => {
                  const rules = checkPasswordRules(value);
                  if (!rules.allPassed)
                    return "Password does not meet requirements";
                  return true;
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
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
                  <View>
                    {!checkPasswordRules(value).allPassed && (
                      <PasswordRules password={value} />
                    )}
                  </View>
                </>
              )}
            />
            {!!errors.password?.message && (
              <Text className='text-red-500 text-xs ml-3 mt-1'>
                {errors.password.message}
              </Text>
            )}
          </View>
          {/* Confirm New Password */}
          <View>
            <Text className='ml-3 mb-1 font-medium'>
              Confirm New Password <Text className='text-error'>*</Text>
            </Text>
            <Controller
              control={control}
              name='confirmPassword'
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field: { onChange, value } }) => (
                <InputWithIcon
                  placeholder='Re-enter your password'
                  value={value}
                  onChangeText={onChange}
                  autoComplete='off'
                  textContentType='none'
                  importantForAutofill='no'
                  secureTextEntry
                  leftIcon={<Lock className='text-primary' size={20} />}
                  editable={!loading}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className='text-red-500 text-xs ml-3 mt-1'>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
          {errorMessage && (
            <Text className='text-error ml-3 text-xs'>{errorMessage}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
