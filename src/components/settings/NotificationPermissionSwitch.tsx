import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router"; // hoặc từ @react-navigation/native
import React from "react";
import { AppState, Linking, Platform, Pressable, View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";

export default function NotificationPermissionSwitch() {
  const [enabled, setEnabled] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const fetchPermission = React.useCallback(async () => {
    setLoading(true);
    const settings = await Notifications.getPermissionsAsync();
    const isEnabled =
      settings.granted ||
      (Platform.OS === "ios" &&
        settings.ios?.status ===
          Notifications.IosAuthorizationStatus.PROVISIONAL);
    setEnabled(isEnabled);
    setLoading(false);
    return isEnabled;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPermission();
    }, [fetchPermission])
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        fetchPermission();
      }
    });
    return () => subscription.remove();
  }, [fetchPermission]);

  const handleToggle = async (value: boolean) => {
    setLoading(true);
    if (value) {
      await Notifications.requestPermissionsAsync();
      const status = await fetchPermission();
      if (!status) Linking.openSettings();
    } else {
      Linking.openSettings();
    }
    setLoading(false);
  };

  return (
    <Pressable
      className='flex-row items-center justify-between bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 active:opacity-80'
      onPress={() => handleToggle(!enabled)}
    >
      <View className='gap-2'>
        <Text className='font-semibold text-neutral-800 dark:text-neutral-200'>
          Notifications
        </Text>
        <Text className='text-neutral-800 dark:text-neutral-400'>
          Receive notifications for daily lesson
        </Text>
      </View>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={loading}
        className='w-[46px]'
      />
    </Pressable>
  );
}
