import { router } from "expo-router";
import { Book } from "lucide-react-native";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {} from "react-native-safe-area-context";
import ThemeIcon from "~/src/components/Icon";
import ThemeToggle from "~/src/components/ThemeToggle";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { LogOut } from "~/src/lib/icons/Logout";
import { useAuthStore } from "~/src/stores/auth.store";

const Settings = () => {
  const { logout } = useAuthStore();
  const handlePushPersonalize = () => {
    router.push({
      pathname: "/(protected)/(tabs)/(home)/personalize",
    });
  };
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView>
        <View className=' h-full p-4 gap-2 '>
          <ThemeToggle />
          <Button
            variant='outline'
            onPress={handlePushPersonalize}
            className='w-full flex-row justify-between items-center'
          >
            <Text className=''>Personalize</Text>
            <ThemeIcon Icon={Book} />
          </Button>
          <View></View>
          <Button
            onPress={logout}
            variant='outline'
            className='w-full flex-row justify-between items-center'
          >
            <Text className='text-error'>Logout</Text>
            <LogOut className='text-error' />
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
