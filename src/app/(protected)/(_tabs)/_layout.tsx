import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
        name='index'
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
        name='achievements'
        options={{
          title: "Achievements",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "trophy-variant" : "trophy-variant-outline"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='todo'
        options={{
          title: "Todo",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "pen" : "pen"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          headerShown: false,
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
