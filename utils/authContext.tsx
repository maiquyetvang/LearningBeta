import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import React, { useEffect } from "react";
SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  login: () => void;
  logout: () => void;
};
export const AuthContext = React.createContext<AuthState | undefined>({
  isLoggedIn: false,
  isReady: false,
  login: () => {},
  logout: () => {},
});

const authStoreKey = "isLoggedIn";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const router = useRouter();
  const storeAuthState = React.useCallback(
    async (newState: { isLoggedIn: boolean }) => {
      try {
        const jsonValue = JSON.stringify(newState);
        await AsyncStorage.setItem(authStoreKey, jsonValue);
      } catch (e) {
        // saving error
        console.error("Error storing auth state", e);
      }
    },
    [router]
  );

  const login = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
    router.replace("/");
  };

  const logout = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
    router.replace("/login");
  };

  useEffect(() => {
    const getAuthState = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const jsonValue = await AsyncStorage.getItem(authStoreKey);
        const authState = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (authState) {
          setIsLoggedIn(authState.isLoggedIn);
        }
      } catch (e) {
        console.error("Error reading auth state", e);
      }
      setIsReady(true);
    };
    getAuthState();
  }, []);
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};
