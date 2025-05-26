import React, { use, useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
// import { ExpoSpeech } from "~/utils/TextToSpeech";
import * as Speech from "expo-speech";
import { SpeakButton } from "../custom-ui/speak-button";
import { Lesson } from "~/src/types/lesson.type";
import { CheckResultButton } from "./CheckResultButton";
import { H3 } from "../ui/typography";
import { cn } from "~/src/lib/utils";

const SimpleSentenceLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answers, hint, audioLanguage } = value.value;
  const [usedWords, setUsedWords] = useState<string[]>([]);

  const handleSelectWord = (value: string) => {
    const isUsed = usedWords.some((e) => e === value);
    if (isUsed) return;
    setUsedWords([...usedWords, value]);
  };

  const handleResetSlot = (index: number) => {
    setUsedWords(usedWords.filter((w, i) => i !== index));
  };
  const handleCheckResults = () => {
    const isCorrect =
      !!answers &&
      !!usedWords &&
      answers.every((answer, index) => answer === usedWords[index]);
    onSuccess?.(!isCorrect);
  };
  const renderSentence = () => {
    return (
      usedWords &&
      usedWords.map((part, index) => {
        const isUsed = usedWords.some((e) => e === part);
        return (
          <Pressable
            key={index}
            className={cn(
              "flex rounded-md items-center bg-neutral-800 dark:bg-neutral-200 p-3 justify-center ",
              !isUsed && "opacity-40"
            )}
            onPress={() => handleResetSlot(index)}
            disabled={disabled}
          >
            <Text
              style={{
                ...styles.blankText,
              }}
              className={`text-background `}
            >
              {part}
            </Text>
          </Pressable>
        );
      })
    );
  };
  return (
    <View className='flex-1 gap-8'>
      {!!question && <H3 className='text-primary text-center'>{question}</H3>}
      <View
        className='bg-neutral-50  h-fit dark:bg-neutral-800'
        style={styles.sentenceContainer}
      >
        {renderSentence()}
      </View>
      <View style={styles.optionsContainer}>
        {selectors &&
          selectors.map((word, idx) => {
            const isUsed = usedWords.some((e) => e === word);
            return (
              <SpeakButton
                key={idx}
                variant='outline'
                onPress={() => {
                  handleSelectWord(word);
                }}
                disabled={isUsed || disabled}
                language={audioLanguage}
                label={word}
              />
            );
          })}
      </View>
      <CheckResultButton
        disabled={!usedWords || usedWords.length === 0}
        onCheck={handleCheckResults}
      />
    </View>
  );
};
export default SimpleSentenceLesson;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 50,
    minHeight: 50,
    borderRadius: 12,
    padding: 8,
    gap: 8,
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
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
