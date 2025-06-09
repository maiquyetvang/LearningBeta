import { Stack } from 'expo-router';

export default function PracticeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chat-bot" />
      <Stack.Screen name="conversation" />
    </Stack>
  );
}
