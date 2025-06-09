import { Sun } from 'lucide-react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Pressable, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Switch } from '~/components/ui/switch';

export default function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(isDarkColorScheme);

  React.useEffect(() => {
    const newTheme = isDarkMode ? 'dark' : 'light';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }, [isDarkMode]);

  return (
    <Pressable
      className="flex-row items-center justify-between bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 active:opacity-80"
      onPress={() => setIsDarkMode(!isDarkMode)}
    >
      <View className="gap-2">
        <Text className="font-semibold text-neutral-800 dark:text-neutral-200">Themes</Text>
        <Text className="text-neutral-800 dark:text-neutral-400">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>
      <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} className="w-[46px]" />
    </Pressable>
  );
}
