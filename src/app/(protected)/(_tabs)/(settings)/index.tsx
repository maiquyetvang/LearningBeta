import { AppImages } from "assets";
import { router } from "expo-router";
import React from "react";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PullToRefreshWrapper from "~/components/common/PullToRefreshWrapper";
import MicrophonePermissionSwitch from "~/components/settings/MicrophonePermissionSwitch";
import MyCourseCard from "~/components/settings/MyCourseCard";
import NotificationPermissionSwitch from "~/components/settings/NotificationPermissionSwitch";
import SettingSection from "~/components/settings/PermissionsSection";
import STTPermissionSwitch from "~/components/settings/STTPermissionSwitch";
import ThemeToggle from "~/components/settings/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { LogOut } from "~/lib/icons/Logout";
import { useAuthStore } from "~/stores/auth.store";
import { useLearningStore } from "~/stores/learning.store";

const Settings = () => {
  const insets = useSafeAreaInsets();
  const { resetLearning, clearInProgressLesson } = useLearningStore();
  const { logout, user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [mic, setMic] = React.useState(true);
  const [stt, setStt] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleEditAccount = () => {
    router.push("/(protected)/(_tabs)/(settings)/EditAccount");
  };
  const handleChangePassword = () => {
    router.push("/(protected)/(_tabs)/(settings)/ChangePassword");
  };

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      style={{ paddingTop: insets.top }}
    >
      <PullToRefreshWrapper refreshing={refreshing} onRefresh={onRefresh}>
        <View className='p-5 gap-5'>
          {/* User Info */}
          <View className='items-center gap-2'>
            <Image
              source={
                user?.avatar
                  ? { uri: user?.avatar }
                  : require("assets/images/avatar-placeholder.png")
              }
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#eee",
              }}
            />
            <Text className='text-lg font-semibold'>
              {user?.name || user?.email}
            </Text>
            {user?.name && (
              <Text className='text-neutral-500'>{user?.email}</Text>
            )}
          </View>

          {/* My Account */}
          <SettingSection title='My Account'>
            <View className='flex-row gap-3'>
              <TouchableOpacity
                className='flex-1 flex-row items-center justify-start rounded-lg p-3 gap-3 bg-success-50 dark:bg-success-900'
                onPress={handleEditAccount}
              >
                <Image
                  source={AppImages.profile}
                  style={{ height: 40, width: 40 }}
                />
                <Text className='font-semibold text-foreground '>
                  Edit Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-1 flex-row items-center justify-start rounded-lg p-3 gap-3 bg-primary-50 dark:bg-primary-900'
                onPress={handleChangePassword}
              >
                <Image
                  source={AppImages.lock}
                  style={{ height: 40, width: 40 }}
                />
                <Text className='font-semibold text-foreground'>
                  Change{"\n"}Password
                </Text>
              </TouchableOpacity>
            </View>
          </SettingSection>

          <SettingSection title='My Course'>
            <MyCourseCard />
          </SettingSection>

          {/* Permissions */}
          <SettingSection title='Permissions'>
            <NotificationPermissionSwitch />
            <MicrophonePermissionSwitch
              checked={mic}
              onCheckedChange={setMic}
            />
            <STTPermissionSwitch checked={stt} onCheckedChange={setStt} />
            <ThemeToggle />
          </SettingSection>
          <View className='flex-row gap-3  hidden'>
            <Button
              variant='secondary'
              onPress={resetLearning}
              className='flex-1'
            >
              <Text>Reset learning</Text>
            </Button>
            <Button
              variant='secondary'
              onPress={clearInProgressLesson}
              className='flex-1'
            >
              <Text>Clear</Text>
            </Button>
          </View>
          <Button
            onPress={logout}
            variant='outline'
            className='w-full flex-row justify-center items-center'
          >
            <LogOut className='text-error mr-2' />
            <Text className='!text-error'>Log out</Text>
          </Button>

          <Text className='text-neutral-400 text-center'>App v.1.0.0</Text>
        </View>
      </PullToRefreshWrapper>
    </SafeAreaView>
  );
};

export default Settings;
