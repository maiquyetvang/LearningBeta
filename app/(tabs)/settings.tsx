import { Pressable, StyleSheet, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const Settings = () => {
  return (
    <View className='flex-1 p-4 gap-2 items-center'>
      <ThemeToggle/>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
