import React from "react";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { ReactQueryProvider } from "./react-query.provider";
import { SplashScreenController } from "~/components/common/splash";

type AppProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const AppProvider = ({ children, theme }: AppProviderProps) => (
  <ReactQueryProvider>
    <ThemeProvider value={theme}>
      {children}
      <PortalHost />
      <SplashScreenController />
    </ThemeProvider>
  </ReactQueryProvider>
);
