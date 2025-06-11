import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ProfileRecord } from '~/lib/powersync/app-schema';
import { User } from '../types/user.type';

type AuthState = {
  isAuthentication: boolean;
  isLoaded: boolean;
  user: User | null;
  loading: boolean;
  session: Session | null;
  profile: ProfileRecord | null;
};

type AuthActions = {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setUser: (user: Partial<User>) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: ProfileRecord | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      session: null,
      profile: null,
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
      setSession: (session) =>
        set(() => ({
          session,
          isAuthentication: !!session,
          isLoaded: true,
        })),
      setProfile: (profile) => set(() => ({ profile })),
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
