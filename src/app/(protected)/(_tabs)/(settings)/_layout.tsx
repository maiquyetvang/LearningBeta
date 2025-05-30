import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='ChangePassword'
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name='EditAccount'
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}
