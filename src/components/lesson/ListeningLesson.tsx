import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Volume2 } from "~/lib/icons/Volume2";
import { useLearningStore } from "~/stores/learning.store";
import { Lesson } from "~/types/lesson.type";
import { SpeakButton } from "../custom-ui/speak-button";
import { Text } from "../ui/text";
import { CannotListenButton } from "./CannotListenButton";
import { CheckResultButton } from "./CheckResultButton";
import { AnimatedButton } from "../custom-ui/animate-button";

const ListeningLesson = ({
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
  const { question, questionLanguage, selectors, answer, selectorLanguage } =
    value.value;
  const [selected, setSelected] = useState<string | null>();
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
  const disabledSpeak = selectorLanguage !== "ko" || disabled;
  return (
    <View className="flex-1 gap-8">
      <Text className="font-light text-center text-sm italic">
        * You can slow down the audio&apos;s speed
      </Text>
      <SpeakButton
        label={question || answer}
        className="w-full"
        showIcon
        language={questionLanguage || selectorLanguage}
        variant={"default"}
        disabled={disabled}
        buttonClassName="justify-center text-xl font-bold"
        hideLabel
        leftIcon={<Volume2 className='text-white' size={20} />}
        customSpeed
      />
      <View style={styles.optionsContainer}>
        {selectors &&
          selectors.map((word, idx) => {
            const isUsed = selected === word;
            return (
              <SpeakButton
                key={idx}
                onPress={() => {
                  handleSelectWord(word);
                }}
                className="w-full"
                disabled={disabled}
                style={{ borderWidth: isUsed ? 1 : 2 }}
                label={word}
                isSelected={isUsed}
                disabledSpeak={disabledSpeak}
                language={selectorLanguage}
              />
            );
          })}
      </View>
      <View className="mt-auto gap-2">
        <CannotListenButton onPress={handleSkip} />
        <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
      </View>
    </View>
  );
};
export default ListeningLesson;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  sentenceText: {
    // fontSize: 18,
    // marginRight: 4,
  },
  blankText: {
    fontWeight: '500',
    // fontSize: 18,
  },
  optionsContainer: {
    flexWrap: 'wrap',
    width: '100%',
    gap: 8,
    // marginTop: "auto",
    // marginBottom: "auto",
  },
  wordButton: {
    backgroundColor: '#EEE',
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
