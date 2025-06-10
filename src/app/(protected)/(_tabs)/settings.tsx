import { AppImages } from "assets";
import { router } from "expo-router";
import React from "react";
import { GestureResponderEvent } from "react-native";
import {
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PullToRefreshWrapper from "~/components/common/PullToRefreshWrapper";
import Avatar from "~/components/settings/Avatar";
import MicrophonePermissionSwitch from "~/components/settings/MicrophonePermissionSwitch";
import MyCourseCard from "~/components/settings/MyCourseCard";
import NotificationPermissionSwitch from "~/components/settings/NotificationPermissionSwitch";
import SettingSection from "~/components/settings/PermissionsSection";
import STTPermissionSwitch from "~/components/settings/STTPermissionSwitch";
import ThemeToggle from "~/components/settings/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { LogOut } from "~/lib/icons/Logout";
import { useSystem } from "~/lib/powersync/system";
import { useAuthStore } from "~/stores/auth.store";
import { useLearningStore } from "~/stores/learning.store";

const Settings = () => {
  const insets = useSafeAreaInsets();
  const { resetLearning, clearInProgressLesson } = useLearningStore();
  const { profile, session } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [mic, setMic] = React.useState(true);
  const [stt, setStt] = React.useState(true);

  const { supabase, powersync } = useSystem();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleEditAccount = () => {
    router.push("/(protected)/edit-account-info");
  };
  const handleChangePassword = () => {
    router.push("/(protected)/change-password");
  };

  const handleLogout = async (event: GestureResponderEvent) => {
    await powersync.disconnectAndClear();
    await supabase.client.auth.signOut();
    router.replace("/(auth)/login");
    // const { error } = await supabaseConnector.signOut({ scope: "local" });
    // if (error) {
    //   console.error("Logout error:", error);
    //   Alert.alert(error.message);
    //   return;
    // }
  };
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  return (
    <SafeAreaView
      className='flex-1 bg-background'
      style={{ paddingTop: insets.top }}
    >
      <PullToRefreshWrapper refreshing={refreshing} onRefresh={onRefresh}>
        <View className='p-5 gap-5'>
          {/* User Info */}
          {/* <Text className='font-light text-xs'>
            {JSON.stringify(supabase.auth.getSession(), null, 8)}
          </Text> */}
          {/* <Avatar
            size={200}
            url={profile?.avatar_url as string | null}
            onUpload={(url: string) => {
              // setAvatarUrl(url);
              // updateProfile({ username, website, avatar_url: url });
              console.log({ url });
            }}
          /> */}
          <View className='items-center gap-2'>
            <Image
              source={
                profile?.avatar_url
                  ? { uri: profile?.avatar_url }
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
              {profile?.full_name || session?.user.email}
            </Text>
            {profile?.full_name && (
              <Text className='text-neutral-500'>{session?.user.email}</Text>
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
            onPress={handleLogout}
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
