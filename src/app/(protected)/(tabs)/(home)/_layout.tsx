import { Redirect, router, Stack } from "expo-router";
import { useEffect } from "react";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='index'
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name='details'
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name='personalize'
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
