import { Tabs } from "expo-router";
// import Colors from "@/constants/Colors";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { SettingsIcon } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors.tabIconSelected,
        // tabBarInactiveTintColor: Colors.tabIconDefault,
        // headerShown: false,
        // tabBarBackground: () => <BlurView intensity={80} tint="dark" style={{
        //     height:"100%"
        // }}  />,
        tabBarStyle: {
          borderTopWidth: 0,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              color={color}
              name='home-variant'
              size={26}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
                name="newAndHot"
                options={{
                    title: "New & Hot",
                    tabBarIcon: ({ color}) => <Octicons color={color} name="video" size={24} />
                }}
            /> */}
      <Tabs.Screen
        name='voice'
        options={{
          title: "Voice",
          //   headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "microphone" : "microphone-outline"}
              size={24}
            />
          ),
          // tabBarIcon: ({ color }) => <SettingsIcon color={color} stroke={color} />,
        }}
      />{" "}
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          //   headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "cog" : "cog-outline"}
              size={24}
            />
          ),
          // tabBarIcon: ({ color }) => <SettingsIcon color={color} stroke={color} />,
        }}
      />
    </Tabs>
  );
}
