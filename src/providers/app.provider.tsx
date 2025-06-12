import React from 'react';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { ReactQueryProvider } from './react-query.provider';
import { SplashScreenController } from '~/components/common/splash';
import { PowersyncProvider } from '~/lib/powersync';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthMiddleware } from '~/feature/auth/auth.middleware';
import { Toaster } from 'sonner-native';
import { StreakModalProvider } from '~/contexts/StreakModalContext';

type AppProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const AppProvider = ({ children, theme }: AppProviderProps) => (
  <PowersyncProvider>
    <ReactQueryProvider>
      <GestureHandlerRootView>
        <ThemeProvider value={theme}>
          <StreakModalProvider>
            {children}
            <Toaster />
            <PortalHost />
            <AuthMiddleware />
          </StreakModalProvider>
        </ThemeProvider>
        <SplashScreenController />
      </GestureHandlerRootView>
    </ReactQueryProvider>
  </PowersyncProvider>
);
