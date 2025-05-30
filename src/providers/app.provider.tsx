import React from "react";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { ReactQueryProvider } from "./react-query.provider";

type AppProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const AppProvider = ({ children, theme }: AppProviderProps) => (
  <ReactQueryProvider>
    <ThemeProvider value={theme}>
      {children}
      <PortalHost />
    </ThemeProvider>
  </ReactQueryProvider>
);
