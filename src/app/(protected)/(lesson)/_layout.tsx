"use client";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useAuthStore } from "~/stores/auth.store";

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
        name='index'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
