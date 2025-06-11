import React, { useState } from 'react';
import { View } from 'react-native';
import { Volume2 } from '~/lib/icons/Volume2';
import { useLearningStore } from '~/stores/learning.store';
import { Lesson } from '~/types/lesson.type';
import { SpeakButton } from '../custom-ui/speak-button';
import { Input } from '../ui/input';
import { Text } from '../ui/text';
import { CannotListenButton } from './CannotListenButton';
import { CheckResultButton } from './CheckResultButton';

const WriteOnlyWordLesson = ({
  value,
  disabled,
  onSuccess,
  onSkip,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
  onSkip?: () => void;
}) => {
  const { setSpeechDisabled } = useLearningStore();
  const { question, answer, questionLanguage } = value.value;

  const [selected, setSelected] = useState<string | undefined>();
  const handleSelectWord = (value: string) => {
    setSelected(value);
  };
  const handleCheckResults = () => {
    const isCorrect = !!answer && answer === selected;
    onSuccess?.(!isCorrect);
  };
  const handleSkip = () => {
    setSpeechDisabled(true);
    onSkip?.();
  };
  // const handleChange = (value: string) => {
  //   if (disabled) return;
  //   setSelected(value);
  // };
  return (
    <View className="flex-1 gap-8">
      <Text className="font-light text-center text-sm italic">
        * You can slow down the audio&apos;s speed
      </Text>
      <SpeakButton
        label={question}
        className="w-full"
        showIcon
        language={questionLanguage}
        variant={'default'}
        buttonClassName="justify-center text-xl font-bold"
        hideLabel
        disabled={disabled}
        leftIcon={<Volume2 className="text-white" size={20} />}
      />

      <Input
        style={{
          minWidth: 50,
          // width: "auto",
          textAlign: 'center',
          paddingHorizontal: 20,
        }}
        // className='w-fit'
        placeholder="Type the answer here"
        onChangeText={handleSelectWord}
        value={selected}
        onSubmitEditing={handleCheckResults}
        editable={!disabled}
      />
      <View className="mt-auto gap-2">
        <CannotListenButton onPress={handleSkip} />
        <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
      </View>
    </View>
  );
};
export default WriteOnlyWordLesson;
