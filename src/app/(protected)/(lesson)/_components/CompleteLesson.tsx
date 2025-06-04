import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { Home } from "lucide-react-native";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Lottie } from "assets";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { playCongratsSound } from "~/utils/playSound";

const CompleteLesson = () => {
  const handleBackHome = () => {
    router.replace("/(protected)/(_tabs)/(_home)");
  };
  useEffect(() => {
    playCongratsSound();
  }, []);
  return (
    <View className='flex-1'>
      <View
        className='flex-1 items-center gap-5 justify-center '
        style={{ marginTop: "auto" }}
      >
        <View className='mx-10 gap-2 bg-neutral-50  dark:bg-neutral-900 rounded-2xl p-3 shadow-sm shadow-neutral-500/50'>
          <Text className='text-center text-2xl font-semibold text-primary'>
            Amazing!
            <Text className='text-center text-2xl'>
              You’ve finished today lesson
            </Text>
          </Text>
        </View>
        <LottieView
          source={Lottie.cheer}
          style={{ height: 240, width: "100%" }}
          autoPlay
          loop
        />
      </View>
      <Button
        className='w-full flex-row items-center gap-2'
        onPress={handleBackHome}
      >
        <Home size={20} color='white' />
        <Text>Back to Homepage</Text>
      </Button>
    </View>
  );
};
CompleteLesson.displayName = "CompleteScene";

export default CompleteLesson;
