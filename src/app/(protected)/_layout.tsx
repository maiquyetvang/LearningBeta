import { Redirect, Stack, usePathname } from 'expo-router';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { useAuthStore } from '~/stores/auth.store';

export default function ProtectedLayout() {
  const { session, loading, profile } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      loading: state.loading,
      profile: state.profile,
    })),
  );
  const pathname = usePathname();

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  if (profile && profile.has_completed_survey === 0 && pathname !== '/personalize') {
    return <Redirect href="/personalize" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(lesson)" options={{ headerShown: false }} />
      <Stack.Screen name="personalize" options={{ headerShown: false }} />
      <Stack.Screen name="overview" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="edit-account-info" options={{ headerShown: false }} />
      <Stack.Screen
        name="practice"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
