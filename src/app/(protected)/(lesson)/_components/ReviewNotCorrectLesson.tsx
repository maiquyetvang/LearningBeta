import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";
import { Lottie } from "assets";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";

const ReviewNotCorrectLesson = ({ onReview }: { onReview?: () => void }) => {
  const handleBackHome = () => {
    router.replace("/(protected)/(_tabs)/(_home)");
  };
  const handleReview = () => {
    onReview?.();
  };
  return (
    <View className='flex-1'>
      <View
        className='flex-1 items-center gap-5 justify-center '
        style={{ marginTop: "auto" }}
      >
        <View className='mx-10 gap-2 bg-neutral-50  dark:bg-neutral-900 rounded-2xl p-3 shadow-sm shadow-neutral-500/50'>
          <Text className='text-center text-2xl font-semibold '>
            Let’s review{"\n"}
            <Text className='text-center text-2xl text-error'>Not Correct</Text>
            answer
          </Text>
        </View>
        <LottieView
          source={Lottie.reading}
          style={{ height: 300, width: "100%" }}
          autoPlay
          loop
        />
      </View>
      <View className='gap-2'>
        <Button
          variant='neutral'
          className='w-full flex-row items-center gap-2'
          onPress={handleBackHome}
        >
          <Home size={20} className='text-foreground' />
          <Text>Back to Homepage</Text>
        </Button>
        <Button
          className='w-full flex-row items-center gap-2'
          onPress={handleReview}
        >
          <Text>OK! Try again</Text>
        </Button>
      </View>
    </View>
  );
};
ReviewNotCorrectLesson.displayName = "CompleteScene";

export default ReviewNotCorrectLesson;
