"use client";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useAuthStore } from "~/stores/auth.store";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='login' />
      <Stack.Screen name='welcome' options={{ animation: "fade" }} />
    </Stack>
  );
}
