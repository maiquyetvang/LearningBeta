import { Lottie } from 'assets';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const ReviewNotCorrectLesson = ({ onReview }: { onReview?: () => void }) => {
  const handleBackHome = () => {
    router.replace("/(protected)/(_tabs)");
  };
  const handleReview = () => {
    onReview?.();
  };
  return (
    <View className="flex-1">
      <View className="flex-1 items-center gap-5 justify-center " style={{ marginTop: 'auto' }}>
        <View className="mx-10 gap-2 bg-neutral-50  dark:bg-neutral-900 rounded-2xl p-3 shadow-sm shadow-neutral-500/50">
          <Text className="text-center text-2xl font-semibold ">
            Let’s review{'\n'}
            <Text className="text-center text-2xl text-error">Not Correct</Text> answer
          </Text>
        </View>
        <LottieView source={Lottie.reading} style={{ height: 300, width: '100%' }} autoPlay loop />
      </View>
      <Button className="w-full flex-row items-center gap-2" onPress={handleReview}>
        <Text>OK! Try again</Text>
      </Button>
    </View>
  );
};
ReviewNotCorrectLesson.displayName = 'CompleteScene';

export default ReviewNotCorrectLesson;
