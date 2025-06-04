import React from "react";
import { View } from "react-native";
import { useLearningStore } from "~/stores/learning.store";
import { AnimatedButton } from "../custom-ui/animate-button";

const TestVoice = () => {
  const { clearInProgressLesson, resetLearning } = useLearningStore();

  return (
    <View className='gap-3 '>
      {/* <View className='gap-3'>
        <AnimatedButton onPress={() => startListening()}>Speak</AnimatedButton>
        <AnimatedButton onPress={() => stopListening()} variant='destructive'>
          Stop
        </AnimatedButton>
      </View> 
      <Text>{JSON.stringify(state, null, 2)}</Text>*/}
      <View className='gap-2 flex-row '>
        <AnimatedButton
          onPress={() => {
            clearInProgressLesson();
          }}
          variant='secondary'
          wrapperClassName='flex-1'
        >
          Clear
        </AnimatedButton>
        <AnimatedButton
          onPress={() => {
            resetLearning();
          }}
          variant='secondary'
          wrapperClassName='flex-1'
        >
          Reset
        </AnimatedButton>
      </View>
    </View>
  );
};
export default TestVoice;
