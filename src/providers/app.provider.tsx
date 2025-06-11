import React from 'react';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { ReactQueryProvider } from './react-query.provider';
import { SplashScreenController } from '~/components/common/splash';
import { PowersyncProvider } from '~/lib/powersync';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthMiddleware } from '~/feature/auth/auth.middleware';
import { Toaster } from 'sonner-native';

type AppProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const AppProvider = ({ children, theme }: AppProviderProps) => (
  <PowersyncProvider>
    <ReactQueryProvider>
      <GestureHandlerRootView>
        <ThemeProvider value={theme}>
          {children}
          <Toaster />
          <PortalHost />
          <AuthMiddleware />
        </ThemeProvider>
        <SplashScreenController />
      </GestureHandlerRootView>
    </ReactQueryProvider>
  </PowersyncProvider>
);
