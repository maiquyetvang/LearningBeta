import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useBoolean } from "usehooks-ts";
import { Lesson } from "~/types/lesson.type";
import { playResultSound } from "~/utils/playSound";
import { SpeakButton } from "../custom-ui/speak-button";
import { H3, P } from "../ui/typography";
const MAX_WRONG_ATTEMPTS = 5;

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const MappingLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answers, questionLanguage, selectorLanguage } =
    value.value;
  const [shuffledSelectors] = useState(() => shuffleArray(selectors ?? []));
  const [shuffledAnswers] = useState(() => shuffleArray(answers ?? []));
  const { value: disableAction, setTrue, setFalse, toggle } = useBoolean(false);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [disabledLeft, setDisabledLeft] = useState<boolean[]>(
    Array(selectors?.length ?? 0).fill(false),
  );

  // Số lần trả lời sai
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const [disabledRight, setDisabledRight] = useState<boolean[]>(
    Array(answers?.length ?? 0).fill(false),
  );
  const [feedback, setFeedback] = useState<{
    left: number | null;
    right: number | null;
    isCorrect: boolean | null;
  }>({ left: null, right: null, isCorrect: null });

  const [anim] = useState(new Animated.Value(1));

  const handleSelectLeft = (idx: number) => {
    if (disabledLeft[idx] || disableAction) return;
    setSelectedLeft(idx);
  };

  const handleSelectRight = (idx: number) => {
    if (disabledRight[idx] || disableAction) return;
    setSelectedRight(idx);
  };

  useEffect(() => {
    if (
      selectedLeft !== null &&
      selectedRight !== null &&
      !disabledLeft[selectedLeft] &&
      !disabledRight[selectedRight]
    ) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      const isCorrect =
        selectors?.indexOf(shuffledSelectors[selectedLeft]) ===
        answers?.indexOf(shuffledAnswers[selectedRight]);
      setFeedback({ left: selectedLeft, right: selectedRight, isCorrect });

      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setTrue();
      playResultSound(!isCorrect);

      timeouts.push(
        setTimeout(() => {
          if (isCorrect) {
            // Xử lý khi trả lời đúng
            const newDisabledLeft = [...disabledLeft];
            const newDisabledRight = [...disabledRight];
            newDisabledLeft[selectedLeft] = true;
            newDisabledRight[selectedRight] = true;
            setDisabledLeft(newDisabledLeft);
            setDisabledRight(newDisabledRight);

            if (newDisabledLeft.every(Boolean) && newDisabledRight.every(Boolean)) {
              onSuccess?.(false); // Hoàn thành thành công
            }
          } else {
            // Tăng số lần trả lời sai
            const newWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(newWrongAttempts);

            // Kiểm tra nếu đã sai quá số lần cho phép
            if (newWrongAttempts >= MAX_WRONG_ATTEMPTS) {
              onSuccess?.(true); // Thất bại
            }
          }
        }, 500),
      );

      timeouts.push(
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setFeedback({ left: null, right: null, isCorrect: null });
          setFalse();
        }, 500),
      );
    }
  }, [selectedLeft, selectedRight]);

  return (
    <View className="flex-1 gap-8">
      {!!question && <H3 className="text-primary text-center">{question}</H3>}

      {/* Hiển thị số lần sai */}
      <View className="items-center">
        <P className={`${wrongAttempts > 0 ? 'text-red-500' : 'text-neutral-500'}`}>
          Attempts remaining: {MAX_WRONG_ATTEMPTS - wrongAttempts}/5
        </P>
      </View>

      <View className="flex-row gap-8 justify-center">
        <View style={styles.optionsContainer}>
          {shuffledSelectors.map((word, idx) => {
            const isFeedback = feedback.left === idx;
            const isSelected = selectedLeft === idx;
            const isUsed = disabledLeft[idx];
            const isZoom = isFeedback && feedback.isCorrect !== null;
            const zoomColor =
              isZoom && feedback.isCorrect === true
                ? '#258124'
                : isZoom && feedback.isCorrect === false
                  ? '#ef4444'
                  : undefined;

            return (
              <Animated.View
                key={idx}
                className={'transition-colors'}
                style={[
                  isFeedback && {
                    transform: [{ scale: anim }],
                    backgroundColor: zoomColor,
                    borderColor: 'white',
                    borderRadius: 6,
                  },
                  { width: '100%' },
                ]}
              >
                <SpeakButton
                  variant={
                    isUsed
                      ? 'success'
                      : isSelected
                        ? zoomColor
                          ? 'ghost'
                          : 'secondary'
                        : 'outline'
                  }
                  onPress={() => handleSelectLeft(idx)}
                  disabled={isUsed}
                  language={selectorLanguage}
                  label={word}
                  className="transition-colors"
                />
              </Animated.View>
            );
          })}
        </View>
        <View style={styles.optionsContainer}>
          {shuffledAnswers.map((word, idx) => {
            const isFeedback = feedback.right === idx;
            const isSelected = selectedRight === idx;
            const isUsed = disabledRight[idx];
            const isZoom = isFeedback && feedback.isCorrect !== null;
            const zoomColor =
              isZoom && feedback.isCorrect === true
                ? '#258124'
                : isZoom && feedback.isCorrect === false
                  ? '#ef4444'
                  : undefined;

            return (
              <Animated.View
                key={idx}
                style={[
                  isFeedback && {
                    transform: [{ scale: anim }],
                    backgroundColor: zoomColor,
                    borderColor: 'white',
                    borderRadius: 6,
                  },
                  { width: '100%' },
                ]}
              >
                <SpeakButton
                  variant={
                    isUsed
                      ? 'success'
                      : isSelected
                        ? zoomColor
                          ? 'ghost'
                          : 'secondary'
                        : 'outline'
                  }
                  onPress={() => handleSelectRight(idx)}
                  disabled={isUsed}
                  language={questionLanguage}
                  label={word}
                  className="transition-colors"
                />
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default MappingLesson;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 50,
    flex: 1,
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
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
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
