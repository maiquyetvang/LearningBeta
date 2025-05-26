"use client";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "~/src/stores/auth.store";

export default function ProtectedLayout() {
  const { isAuthentication, user, logout } = useAuthStore();

  useEffect(() => {
    if (user && !user.stayLogin && isAuthentication) {
      logout();
    }
  }, [logout]);

  if (!isAuthentication || !user) {
    return <Redirect href='/welcome' />;
  }
  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
