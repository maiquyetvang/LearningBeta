import { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import ThemeToggle from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/utils/authContext";
import { LogOut } from "~/lib/icons/Logout";

const Settings = () => {
  const authContext = useContext(AuthContext);
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView>
        <View className=' h-full p-4 gap-2 '>
          <ThemeToggle />
          <View></View>
          <Button
            onPress={authContext?.logout}
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
