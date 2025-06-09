import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Lesson } from '~/types/lesson.type';
import { SpeakButton } from '../custom-ui/speak-button';
import { Text } from '../ui/text';
import { CheckResultButton } from './CheckResultButton';

const SingleChooseLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answer, image, audioLanguage } = value.value;
  const [selected, setSelected] = useState<string | null>();
  const handleSelectWord = (value: string) => {
    setSelected(value);
  };
  const handleCheckResults = () => {
    const isCorrect = !!answer && answer === selected;
    onSuccess?.(!isCorrect);
  };
  return (
    <View className="flex-1 gap-8">
      {!!question && (
        <Text className="font-semibold text-xl text-center text-primary">{question}</Text>
      )}
      {image && (
        <View className="items-center justify-center">
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            resizeMode="contain"
            style={{
              width: '100%',
              height: 200,
            }}
          />
        </View>
      )}
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
                language={audioLanguage}
              />
            );
          })}
      </View>
      <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
    </View>
  );
};
export default SingleChooseLesson;

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
