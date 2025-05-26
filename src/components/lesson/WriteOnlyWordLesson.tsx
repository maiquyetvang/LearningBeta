import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Volume2 } from "~/src/lib/icons/Volume2";
import { Lesson } from "~/src/types/lesson.type";
import { SpeakButton } from "../custom-ui/speak-button";
import { Text } from "../ui/text";
import { CheckResultButton } from "./CheckResultButton";
import { Input } from "../ui/input";

const WriteOnlyWordLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answer, image, audioLanguage } = value.value;

  const [selected, setSelected] = useState<string | undefined>();
  const handleSelectWord = (value: string) => {
    setSelected(value);
  };
  const handleCheckResults = () => {
    const isCorrect = !!answer && answer === selected;
    onSuccess?.(!isCorrect);
  };
  // const handleChange = (value: string) => {
  //   if (disabled) return;
  //   setSelected(value);
  // };
  return (
    <View className='flex-1 gap-8'>
      <Text className='font-light text-center text-sm italic'>
        * You can slow down the audio&apos;s speed
      </Text>
      <SpeakButton
        label={answer}
        className='w-full'
        showIcon
        language={audioLanguage}
        variant={"default"}
        buttonClassName='justify-center text-xl font-bold'
        hideLabel
        disabled={disabled}
        leftIcon={<Volume2 className='text-white' size={20} />}
      />

      <Input
        style={{
          minWidth: 50,
          width: "auto",
          textAlign: "center",
          paddingHorizontal: 20,
        }}
        className='w-fit'
        placeholder='Type the answer here'
        onChangeText={handleSelectWord}
        value={selected}
        onSubmitEditing={handleCheckResults}
        editable={!disabled}
      />
      <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
    </View>
  );
};
export default WriteOnlyWordLesson;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 50,
  },
  sentenceText: {
    // fontSize: 18,
    // marginRight: 4,
  },
  blankText: {
    fontWeight: "500",
    // fontSize: 18,
  },
  optionsContainer: {
    flexWrap: "wrap",
    width: "100%",
    gap: 8,
    // marginTop: "auto",
    // marginBottom: "auto",
  },
  wordButton: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    margin: 4,
  },
  wordButtonDisabled: {
    opacity: 0.4,
  },
  wordText: {
    // fontSize: 18,
  },
});
