import { useRouter } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/utils/authContext";

export default function LoginScreen() {
  const authState = useContext(AuthContext);
  return (
    <SafeAreaView>
      <View className='justify-center items-center h-screen'>
        <Text className='text-2xl font-bold text-foreground '>Login</Text>
        <Button onPress={authState?.login}>
          <Text>login</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
