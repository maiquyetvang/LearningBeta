import React from 'react';
import { Pressable, View } from 'react-native';
import { Switch } from '~/components/ui/switch';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '../ui/text';

export default function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(isDarkColorScheme);

  React.useEffect(() => {
    const newTheme = isDarkMode ? 'dark' : 'light';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
