import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ProgressStep } from "~/src/components/custom-ui/progress";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";

const CompleteScene = ({ progress }: { progress: ProgressStep[] }) => {
  const countResult = (progress: ProgressStep[]) => {
    return !progress
      ? 0
      : progress.length - progress.filter((p) => p.isFalse).length;
  };
  const getResultColor = (
    correctCount: number,
    totalCount: number
  ): string | undefined => {
    if (!totalCount) return;
    const ratio = correctCount / totalCount;
    if (ratio >= 0.8) return "text-green-500";
    if (ratio >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };
  return (
    <View className='flex-1 gap-3 justify-center items-center text-center text-2xl '>
      <Text className='text-center text-xl '>Your result</Text>
      <Text
        className={`text-center text-2xl font-semibold ${getResultColor(countResult(progress), progress?.length)}`}
      >
        {countResult(progress)}/{progress?.length}
      </Text>
      <Text className='text-center text-xl'>
        You've completed the test. We will provide the fittest learning path
        base on your result
      </Text>
      <Button className='' onPress={() => router.back()}>
        <Text>Back home</Text>
      </Button>
    </View>
  );
};
CompleteScene.displayName = "CompleteScene";

export default CompleteScene;
