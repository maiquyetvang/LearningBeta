import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Volume2 } from "~/lib/icons/Volume2";
import { Lesson } from "~/types/lesson.type";
import { SpeakButton } from "../custom-ui/speak-button";
import { Text } from "../ui/text";
import { CheckResultButton } from "./CheckResultButton";
import { Input } from "../ui/input";
import { H3 } from "../ui/typography";

const WriteWordLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, hint, answer } = value.value;

  const [selected, setSelected] = useState<string | undefined>();
  const handleSelectWord = (value?: string) => {
    setSelected(value);
  };
  const handleCheckResults = () => {
    if (!answer || !selected) {
      return;
    }
    const isCorrect = !!answer && answer === selected;
    onSuccess?.(!isCorrect);
  };
  const renderSentence = () => {
    if (!question) return <></>;
    const parts = question.split("___");
    return parts.map((part, index) => (
      <View key={index} className='w-fit flex-row items-center'>
        <Text
          style={{
            ...styles.sentenceText,
          }}
        >
          {part}
        </Text>

        {index + 1 < parts.length && (
          <Input
            style={{
              minWidth: 80,
              width: "auto",
              textAlign: "center",
            }}
            onChange={(e) => handleSelectWord(e.nativeEvent.text)}
            value={selected}
            editable={!disabled}
            onSubmitEditing={handleCheckResults}
          />
        )}
      </View>
    ));
  };
  return (
    <View className='flex-1 gap-8'>
      <Text className='font-light text-center text-sm italic'>
        * You can slow down the audio&apos;s speed
      </Text>
      {hint && <H3 className='text-primary text-center'>{hint}</H3>}

      <View className='flex-wrap  flex-row items-center justify-center gap-1'>
        {renderSentence()}
      </View>
      <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
    </View>
  );
};
export default WriteWordLesson;

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
