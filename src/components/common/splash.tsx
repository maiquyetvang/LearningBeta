import { SplashScreen } from "expo-router";
import { useAuthStore } from "~/stores/auth.store";

export function SplashScreenController() {
  const { loading: isLoading } = useAuthStore();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
