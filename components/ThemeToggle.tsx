import { Sun } from "lucide-react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export default function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Button
      onPress={toggleColorScheme}
      className='w-full flex-row items-center justify-between'
      variant='outline'
    >
      <Text>Themes</Text>
      {isDarkColorScheme ? (
        <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />
      ) : (
        <Sun size={24} strokeWidth={1.25} />
      )}
    </Button>
  );
}
