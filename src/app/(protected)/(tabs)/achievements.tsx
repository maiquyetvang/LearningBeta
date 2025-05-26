import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {} from "react-native-safe-area-context";
import { Text } from "~/src/components/ui/text";
import { useAuthStore } from "~/src/stores/auth.store";

const Achievements = () => {
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
          <Text className='text-error'>Achievement</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Achievements;

const styles = StyleSheet.create({});
