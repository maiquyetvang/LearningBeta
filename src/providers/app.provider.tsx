import { Theme, ThemeProvider } from '@react-navigation/native';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PortalHost } from '@rn-primitives/portal';
import React from 'react';
import { ReactQueryProvider } from './react-query.provider';
import { SplashScreenController } from '~/components/common/splash';

type AppProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const AppProvider = ({ children, theme }: AppProviderProps) => (
  <ReactQueryProvider>
    <KeyboardProvider>
      <ThemeProvider value={theme}>
        {children}
        <PortalHost />
        <SplashScreenController />
      </ThemeProvider>
    </KeyboardProvider>
  </ReactQueryProvider>
);
