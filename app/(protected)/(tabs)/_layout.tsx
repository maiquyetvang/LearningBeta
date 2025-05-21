import { Tabs } from "expo-router";
// import Colors from "@/constants/Colors";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { SettingsIcon } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "home-variant" : "home-variant-outline"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "cog" : "cog-outline"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
