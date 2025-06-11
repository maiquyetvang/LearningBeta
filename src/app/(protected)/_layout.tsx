import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useSystem } from '~/lib/powersync/system';
import { useAuthStore } from '~/stores/auth.store';
import { useShallow } from 'zustand/shallow';

export default function ProtectedLayout() {
  const { session, loading, profile } = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      loading: state.loading,
      profile: state.profile,
    })),
  );

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!!profile?.has_completed_survey && profile?.has_completed_survey === 0) {
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
