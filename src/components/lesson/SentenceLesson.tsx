import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '~/lib/utils';
import { Lesson } from '~/types/lesson.type';
import { SpeakButton } from '../custom-ui/speak-button';
import { H3 } from '../ui/typography';
import { CheckResultButton } from './CheckResultButton';

const SentenceLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answers, selectorLanguage } = value.value;
  const [selected, setSelected] = useState<(string | null)[]>(Array(answers?.length).fill(null));
  const [usedWords, setUsedWords] = useState<{ index: number; value: string }[]>([]);
  const [nextIndex, setNextIndex] = useState<number>(0);

  const getNextUnusedIndex = (usedWords: { index: number; value: string }[]): number => {
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
      answers.length === usedWords.length &&
      answers.every((val, i) => val === usedWords.find((v) => v.index === i)?.value) &&
      !selected.includes(null);
    onSuccess?.(!isCorrect);
  };

  const renderSentence = () => {
    return (
      selectors &&
      selectors.map((part, index) => {
        const isUsed = usedWords.some((e) => e.index === index);
        return (
          <>
            {index < selected.length && (
              <Pressable
                key={index}
                className={cn(
                  'flex rounded-md items-center bg-neutral-800 dark:bg-neutral-200 p-3 justify-center h-fit  ',
                  !isUsed && index !== nextIndex && 'opacity-40',
                )}
                onPress={() => handleResetSlot(index)}
              >
                <Text
                  style={{
                    ...styles.blankText,
                  }}
                  className={`text-background ${index === nextIndex && 'text-[#007AFF]'}`}
                >
                  {selected[index] ?? '______'}
                </Text>
              </Pressable>
            )}
          </>
        );
      })
    );
  };

  return (
    <View className="flex-1 gap-8">
      <Text>{JSON.stringify(value)}</Text>
      {!!question && <H3 className="text-primary text-center">{question}</H3>}
      <View
        className="bg-neutral-50 gap-2 dark:bg-neutral-800 rounded-xl p-2 "
        style={styles.sentenceContainer}
      >
        {renderSentence()}
      </View>
      <View style={styles.optionsContainer}>
        {selectors &&
          selectors.map((word, idx) => {
            const isUsed = usedWords.some((e) => e.value === word);
            return (
              <SpeakButton
                key={idx}
                variant="outline"
                onPress={() => {
                  handleSelectWord(nextIndex, word);
                }}
                disabled={isUsed}
                language={selectorLanguage}
                label={word}
              ></SpeakButton>
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

export default SentenceLesson;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
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
