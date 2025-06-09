import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />

      <Stack.Screen
        name="overview"
        options={{
          presentation: 'fullScreenModal',
        }}
      />
    </Stack>
  );
}
