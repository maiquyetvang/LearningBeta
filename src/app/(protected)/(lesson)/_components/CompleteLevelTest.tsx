import { Lottie } from 'assets';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ProgressStep } from '~/components/custom-ui/progress';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { playCongratsSound } from '~/utils/playSound';

const CompleteLevelTest = ({ progress }: { progress: ProgressStep[] }) => {
  const countResult = (progress: ProgressStep[]) => {
    return !progress ? 0 : progress.length - progress.filter((p) => p.isFalse).length;
  };
  const resultColor = () => {
    const correctCount = countResult(progress);
    const totalCount = progress?.length || 0;
    if (!totalCount) return '';
    const ratio = correctCount / totalCount;
    if (ratio >= 0.8) return 'text-green-500';
    if (ratio >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };
  const isGoodResult = () => {
    const correctCount = countResult(progress);
    const totalCount = progress?.length || 0;
    if (!totalCount) return false;
    const ratio = correctCount / totalCount;
    return ratio >= 0.5;
  };

  useEffect(() => {
    const isGoodResultValue = isGoodResult();
    playCongratsSound(!isGoodResultValue);
  }, []);
  const handleBack = () => {
    router.replace("/(protected)/(_tabs)");
  };
  return (
    <View className="flex-1 gap-3 justify-center items-center text-center text-2xl ">
      <View className="mx-10 gap-2 bg-neutral-50  dark:bg-neutral-900 rounded-2xl p-3 shadow-sm shadow-neutral-500/50">
        <Text className="text-center text-2xl font-semibold text-primary">
          {isGoodResult() ? 'Amazing! ' : "Don't worry! "}
          <Text className="text-center text-2xl">
            {isGoodResult() ? 'You’ve finished today lesson' : 'I will help you level up'}
          </Text>
        </Text>
      </View>
      <LottieView
        source={isGoodResult() ? Lottie.cheer : Lottie.sad}
        style={{ height: 240, width: '100%' }}
        autoPlay
        loop
      />
      {/* <Image
        source={isGoodResult() ? AppImages.kindo_congrats : AppImages.kindo_sad}
        style={{ width: 240, height: 240, objectFit: "cover" }}
      /> */}
      <Text className="text-center font-semibold ">Your result</Text>
      <Text className={`text-center text-2xl font-semibold ${resultColor()}`}>
        {countResult(progress)}/{progress?.length}
      </Text>
      <Text className="text-center font-normal">
        You've completed the test. We will provide the fittest learning path base on your result
      </Text>
      <Button onPress={handleBack}>
        <Text>Back home</Text>
      </Button>
    </View>
  );
};
CompleteLevelTest.displayName = 'CompleteScene';

export default CompleteLevelTest;
