import { View } from "lucide-react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Button
      onPress={toggleColorScheme}
      className='w-full web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
      variant='outline'
    >
      {({ pressed }) => (
        <View
          className={cn(
            "flex-row flex w-full justify-between items-center web:px-5",
            pressed && "opacity-70"
          )}
        >
          {/* <Text className='truncate w-full'>Themes</Text> */}
          {isDarkColorScheme ? (
            <MoonStar
              className='text-foreground'
              size={23}
              strokeWidth={1.25}
            />
          ) : (
            <Sun className='text-foreground' size={24} strokeWidth={1.25} />
          )}
        </View>
      )}
    </Button>
  );
}
