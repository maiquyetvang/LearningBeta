import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import ThemeIcon from "../Icon";
import { X } from "lucide-react-native";
import { SpeakButton } from "../custom-ui/speak-button";
import { Lesson } from "~/src/types/lesson.type";
import { CheckResultButton } from "./CheckResultButton";

const SelectLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answers } = value.value;
  const [selected, setSelected] = useState<(string | null)[]>(
    Array(answers?.length).fill(null)
  );
  const [usedWords, setUsedWords] = useState<
    { index: number; value: string }[]
  >([]);
  const [nextIndex, setNextIndex] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
  const getNextUnusedIndex = (
    usedWords: { index: number; value: string }[]
  ): number => {
    const usedIndices = new Set(usedWords.map((word) => word.index));
    let i = 0;
    while (usedIndices.has(i)) {
      i++;
    }
    return i;
  };

  useEffect(() => {
    const nextUnusedIndex = getNextUnusedIndex(usedWords);
    setNextIndex(nextUnusedIndex);
  }, [usedWords]);

  const handleSelectWord = (index: number, value: string) => {
    const firstEmpty = selected.findIndex((v) => v === null);
    if (firstEmpty === -1 || usedWords.some((e) => e.value === value)) return;

    const updated = [...selected];
    updated[firstEmpty] = value;
    setSelected(updated);
    setUsedWords([...usedWords, { index, value }]);

    const isCorrect =
      updated.every((val, i) => answers && val === answers[i]) &&
      !updated.includes(null);
    // if (isCorrect && onSuccess) {
    //   onSuccess();
    // }
  };
  const handleResetSlot = (index: number) => {
    const word = selected[index];
    if (!word) return;

    const updatedSelected = [...selected];
    updatedSelected[index] = null;
    setSelected(updatedSelected);

    setUsedWords(usedWords.filter((w) => w.value !== word));
  };
  const handleCheckResults = () => {
    const isCorrect =
      !!answers &&
      answers.every(
        (val, i) => val === usedWords.find((value) => value.index === i)?.value
      ) &&
      !selected.includes(null);
    setIsSuccess(isCorrect);
    onSuccess?.(!isCorrect);
  };

  const renderSentence = () => {
    if (!question) return <></>;
    const parts = question.split("___");
    return parts.map((part, index) => (
      <>
        {part.split(" ").map((word, i) => (
          <Text
            key={i}
            style={{
              ...styles.sentenceText,
              marginRight: 4,
              alignSelf: "center",
            }}
          >
            {word}
          </Text>
        ))}

        {index < selected.length && (
          <Button
            key={index}
            className='flex '
            variant='outline'
            disabled={disabled}
            onPress={() => handleResetSlot(index)}
          >
            <Text
              style={{
                ...styles.blankText,
                // color: index === nextIndex ? "#007AFF" : undefined,
              }}
              className={`${index === nextIndex && "text-blue-500"}`}
            >
              {selected[index] ?? "______"}
            </Text>
            {selected[index] && (
              <View className='absolute p-0.5 dark:bg-neutral-900 bg-neutral-100 rounded-lg -right-2 -top-2'>
                <ThemeIcon Icon={X} size={16} />
              </View>
            )}
          </Button>
        )}
      </>
    ));
  };

  return (
    <View className='flex-1 gap-2'>
      <View style={styles.sentenceContainer}>{renderSentence()}</View>
      <View style={styles.optionsContainer}>
        {selectors &&
          selectors.map((word, idx) => {
            const isUsed = usedWords.some((e) => e.value === word);
            return (
              <SpeakButton
                key={idx}
                variant='outline'
                onPress={() => {
                  handleSelectWord(nextIndex, word);
                }}
                disabled={isUsed || disabled}
                label={word}
                className=''
              >
                {/* <Text className={`${isUsed && "text-transparent"}`}>
                  {word}
                </Text> */}
              </SpeakButton>
            );
          })}
      </View>

      <CheckResultButton
        disabled={answers?.length !== usedWords.length}
        onCheck={handleCheckResults}
      />
    </View>
  );
};
export default SelectLesson;

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
    flexDirection: "row",
    flexWrap: "wrap",
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
