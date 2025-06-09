import { createJSONStorage, persist } from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user.type';
import { create } from 'zustand';
import { removeFromStorage } from './../utils/storage';
import { use } from 'react';

type AuthState = {
  isAuthentication: boolean;
  isLoaded: boolean;
  user: User | null;
  loading: boolean;
};

type AuthActions = {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setUser: (user: Partial<User>) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isAuthentication: false,
      isLoaded: false,
      user: null,
      loading: false,
      login: (user) =>
        set(() => ({
          isAuthentication: true,
          user,
          isLoaded: true,
          loading: false,
        })),
      logout: () =>
        set((state) => ({
          isAuthentication: false,
          user: state.user?.remember ? { ...state.user } : null,
          isLoaded: true,
          loading: false,
        })),
      setLoading: (loading) => set(() => ({ loading })),
      setLoaded: (isLoaded) => set(() => ({ isLoaded })),
      setUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // storage: {
      //   getItem: async (name) => {
      //     const value = await AsyncStorage.getItem(name);
      //     const parsedValue = value ? JSON.parse(value) : null;
      //     return parsedValue;
      //   },
      //   setItem: async (name, value) => {
      //     await AsyncStorage.setItem(name, JSON.stringify(value));
      //   },
      //   removeItem: async (name) => {
      //     await AsyncStorage.removeItem(name);
      //   },
      // },
    },
  ),
);
