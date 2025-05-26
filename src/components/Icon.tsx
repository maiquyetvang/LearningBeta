import React from "react";
import { useColorScheme } from "react-native";

type ThemeIconProps = {
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  size?: number;
  lightColor?: string;
  darkColor?: string;
};

const ThemeIcon: React.FC<ThemeIconProps> = ({
  Icon,
  size,
  lightColor = "#000",
  darkColor = "#fff",
}) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? darkColor : lightColor;

  return <Icon color={color} size={size} />;
};

export default ThemeIcon;
