import { Stack } from "expo-router";

export default function AchievementLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='index'
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
