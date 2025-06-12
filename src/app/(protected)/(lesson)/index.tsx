import BottomSheet from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepProgressBar, { ProgressStep } from '~/components/custom-ui/progress';
import ThemeIcon from '~/components/Icon';
import ListeningLesson from '~/components/lesson/ListeningLesson';
import MappingLesson from '~/components/lesson/MappingLesson';
import SelectLesson from '~/components/lesson/SelectLesson';
import SimpleSentenceLesson from '~/components/lesson/SimpleSentenceLesson';
import SingleChooseImageLesson from '~/components/lesson/SingleChooseImageLesson';
import SingleChooseLesson from '~/components/lesson/SingleChooseLesson';
import SpeakingLesson from '~/components/lesson/SpeakingLesson';
import WriteOnlyWordLesson from '~/components/lesson/WriteOnlyWordLesson';
import WriteWordLesson from '~/components/lesson/WriteWordLesson';
import { Text } from '~/components/ui/text';
import { useMarkCompleteLesson } from '~/feature/lesson/hooks/use-add-complete-lesson';
import { useAddLearningTime } from '~/feature/lesson/hooks/use-add-user-learning-time';
import { useGetLesson } from '~/feature/lesson/hooks/use-get-lesson';
import {
  QuestionWithParsedContent,
  useGetQuestions,
} from '~/feature/lesson/hooks/use-get-questions';
import { useLocalLearningStore } from '~/stores/learning.store';
import { ELessonType } from '~/types/lesson.type';
import { playResultSound } from '~/utils/playSound';
import CompleteLesson from '../../../feature/lesson/components/CompleteLesson';
import CompleteLevelTest from '../../../feature/lesson/components/CompleteLevelTest';
import ReviewNotCorrectLesson from '../../../feature/lesson/components/ReviewNotCorrectLesson';
import LessonBottomSheet from './_components/LessonBottomSheet';

const LessonDetailScreen: React.FC = () => {
  const { id: lessonId } = useLocalSearchParams<{ id: string }>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    saveInProgressLesson,
    inProgressLesson,
    clearInProgressLesson,
    isAudioDisabled,
    isSpeechDisabled,
    setAudioDisabled,
    setSpeechDisabled,
  } = useLocalLearningStore();

  const { mutateAsync: addLearningTime } = useAddLearningTime();

  const { data: questions } = useGetQuestions(lessonId);
  const { data: lessonDetail } = useGetLesson({ id: lessonId });
  const isLevelTest = lessonDetail?.is_level_test === 1;

  const { mutateAsync: markLessonAsLearned } = useMarkCompleteLesson();

  const [currentIndex, setCurrentIndex] = useState<number>(
    inProgressLesson?.lessonId === lessonId ? inProgressLesson?.currentIndex || 0 : 0,
  );
  const [progress, setProgress] = useState<ProgressStep[]>(
    inProgressLesson?.lessonId === lessonId ? inProgressLesson?.progress || [] : [],
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean | undefined>();
  const [isFalse, setIsFalse] = useState<boolean | undefined>();
  const [stepStartTime, setStepStartTime] = useState<number>(() => Date.now());
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndexes, setReviewIndexes] = useState<number[]>([]);
  const [reviewCurrent, setReviewCurrent] = useState(0);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setIsFalse(undefined);
  }, []);

  const handleNextStep = () => {
    setDisabled(false);
    closeBottomSheet();
    if (reviewMode) {
      setReviewCurrent((prevStep) => {
        return prevStep + 1;
      });
    } else {
      setCurrentIndex((prevStep) => {
        return prevStep + 1;
      });
    }
  };

  const handleSuccess = useCallback(
    async (isFalse?: boolean, isSkip?: boolean) => {
      const now = Date.now();
      const duration = now - stepStartTime;
      const index = reviewMode ? reviewIndexes[reviewCurrent] : currentIndex;
      if (!isLevelTest) {
        await addLearningTime(duration);
      }
      setProgress((prev) => {
        const exists = prev.some((step) => step.index === index);
        let updated;
        if (exists) {
          updated = prev.map((step) =>
            step.index === index ? { ...step, isFalse, duration } : step,
          );
        } else {
          updated = [...prev, { index: index, isFalse, duration }];
        }
        // Sắp xếp theo index tăng dần
        return updated.sort((a, b) => a.index - b.index);
      });
      setIsFalse(isFalse);
      setDisabled(true);
      setStepStartTime(Date.now());
      if (!isSkip) {
        openBottomSheet();
        playResultSound(isFalse);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, currentIndex, stepStartTime, reviewCurrent, reviewMode, reviewIndexes],
  );
  const checkIsSkip = (currentIndex: number) => {
    const type = questions && questions[currentIndex]?.type;
    if (!type) return false;
    if (type === ELessonType.Speaking) {
      if (isAudioDisabled) {
        return true;
      }
    }
    if (type === ELessonType.Listening || type === ELessonType.WriteOnlyWord) {
      if (isSpeechDisabled) {
        return true;
      }
    }
    return false;
  };
  const handleReset = () => {
    setCurrentIndex(0);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(protected)/(_tabs)');
    }
  };
  const openBottomSheet = () => {
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 50);
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const lessonTitleMap: Record<ELessonType, string> = {
    [ELessonType.Speaking]: 'Read out the sentence below',
    [ELessonType.Sentence]: 'Translate this sentence',
    [ELessonType.Select]: 'Complete the sentence below',
    [ELessonType.SingleImageChoose]: 'Choose the right translation',
    [ELessonType.SingleChoose]: 'Choose the right translation',
    [ELessonType.Listening]: 'Choose the right answer for what you heard',
    [ELessonType.WriteOnlyWord]: 'Write the right answer for what you heard',
    [ELessonType.WriteWord]: 'Translate this sentence',
    [ELessonType.Mapping]: 'Match the correct pairs',
  };

  const renderTitle = (index: number) => {
    if (!questions || index >= questions.length || !questions[index]) return null;
    const type = questions[index].type;
    const text = type ? lessonTitleMap[type as ELessonType] : '';
    return (
      <View key={index} className="flex-row w-full gap-2 items-center justify-center">
        <Image
          source={require('assets/images/small-italic-icon.png')}
          style={{ width: 52, height: 60 }}
          resizeMode="contain"
        />
        <View className="flex-1 px-5 py-3 rounded-full shadow-popover shadow-sm bg-neutral-50 dark:bg-neutral-900">
          <Text className="text-md font-medium text-foreground">{text}</Text>
        </View>
      </View>
    );
  };
  const lessonComponentMap = {
    [ELessonType.Speaking]: SpeakingLesson,
    [ELessonType.Select]: SelectLesson,
    [ELessonType.Sentence]: SimpleSentenceLesson,
    [ELessonType.SingleChoose]: SingleChooseLesson,
    [ELessonType.SingleImageChoose]: SingleChooseImageLesson,
    [ELessonType.Listening]: ListeningLesson,
    [ELessonType.WriteOnlyWord]: WriteOnlyWordLesson,
    [ELessonType.WriteWord]: WriteWordLesson,
    [ELessonType.Mapping]: MappingLesson,
  };

  const renderStep = (index: number) => {
    if (!questions || index >= questions.length || !questions[index])
      return (
        <Text className="text-error font-semibold">
          Fail render {questions ? questions[index]?.type : 'no data'}
        </Text>
      );

    const type = questions[index].type as ELessonType;
    const LessonComponent = lessonComponentMap[type];
    if (!LessonComponent)
      return <Text className="text-error font-semibold">Unknown lesson type: {type}</Text>;
    return (
      <LessonComponent
        key={index}
        value={questions[index]}
        onSuccess={handleSuccess}
        disabled={disabled}
        onSkip={() => handleSuccess(true)}
      />
    );
  };

  const renderReviewStep = () => {
    if (
      !reviewMode ||
      reviewCurrent >= reviewIndexes.length ||
      reviewIndexes.length === 0 ||
      !questions
    )
      return null;
    const index = reviewIndexes[reviewCurrent];
    if (index === undefined || !questions[index]) return null;
    const LessonComponent = lessonComponentMap[questions[index].type as ELessonType];
    if (!LessonComponent) return null;
    return (
      <LessonComponent
        key={index}
        value={questions[index]}
        onSuccess={handleSuccess}
        disabled={disabled}
        onSkip={() => handleSuccess(true)}
      />
    );
  };
  const renderCompleteScreen = () => {
    if (isLevelTest) {
      return <CompleteLevelTest progress={progress} />;
    }
    if (progress.some((p) => p.isFalse)) {
      return <ReviewNotCorrectLesson onReview={handleReview} />;
    }
    return <CompleteLesson />;
  };

  const handleReview = () => {
    setDisabled(false);
    const incorrectIndexes = progress.filter((p) => p.isFalse).map((p) => p.index);
    console.log({ incorrectIndexes });
    setReviewIndexes(incorrectIndexes);
    setCurrentIndex(incorrectIndexes[0]);
    setReviewCurrent(0);
    setReviewMode(true);
    setAudioDisabled(false);
    setSpeechDisabled(false);
  };

  // Check if the lesson is completed
  useEffect(() => {
    if (reviewMode) {
      if (reviewCurrent >= reviewIndexes.length) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      return;
    }
    if (questions && currentIndex === questions.length) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, reviewCurrent, reviewIndexes]);

  // Check if the lesson is skipped
  useEffect(() => {
    if (checkIsSkip(reviewMode ? reviewIndexes[reviewCurrent] : currentIndex)) {
      handleSuccess(true, true);
      handleNextStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, reviewCurrent]);

  useEffect(() => {
    return () => {
      setAudioDisabled(false);
      setSpeechDisabled(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, reviewMode]);

  //Handle save completed lesson
  useEffect(() => {
    const handleComplete = async () => {
      if (isCompleted && lessonId && (isLevelTest || !progress.some((p) => p.isFalse))) {
        const totalTimeSpent = progress.reduce((total, step) => total + (step.duration || 0), 0);
        clearInProgressLesson();
        await markLessonAsLearned({
          lesson_id: lessonId,
          course_id: lessonDetail?.course_id!,
          time_spent: totalTimeSpent,
        });
      }
    };
    handleComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, lessonId, progress]);

  // handle saving in-progress lesson
  useEffect(() => {
    if (lessonId && questions && !isCompleted) {
      saveInProgressLesson({
        lessonId,
        currentIndex: progress.length,
        progress,
        totalLesson: questions.length,
        reviewIndexes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, currentIndex, progress, isCompleted, reviewIndexes]);

  useEffect(() => {
    if (
      inProgressLesson?.progress &&
      questions &&
      inProgressLesson?.progress.length === questions?.length &&
      inProgressLesson.progress.length > 0
    ) {
      handleReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (
    data: QuestionWithParsedContent[],
    isFalse: boolean | undefined,
    currentIndex: number,
  ) => {
    if (data && isFalse && data[currentIndex]) {
      // Handle special cases for different lesson types
      if (data[currentIndex].type === ELessonType.Mapping) {
        return data[currentIndex].value.selectors?.reduce((acc, selector, idx) => {
          return (
            acc +
            `\n${idx + 1}. ${selector} - ${data[currentIndex].value.answers?.[idx] || 'No answer'}`
          );
        }, 'Correct answer: ');
      }
      // For other lesson types, we can return the answer directly
      const answer = data[currentIndex].value.answer || data[currentIndex].value.answers?.join(' ');
      return `Correct answer: ${answer}`;
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-5 px-5 pb-5">
      <View className="gap-2">
        <View className="gap-2 w-full flex-row items-center justify-between ">
          <TouchableOpacity onPress={handleReset}>
            <ThemeIcon Icon={X} size={28} />
          </TouchableOpacity>
          {!isCompleted && (
            <StepProgressBar
              currentIndex={
                reviewMode
                  ? reviewCurrent < reviewIndexes.length
                    ? reviewIndexes[reviewCurrent]
                    : questions?.length
                  : currentIndex
              }
              progressStep={progress}
              length={questions?.length}
            />
          )}
        </View>
      </View>

      {!questions || questions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-center font-semibold">No lessons available</Text>
        </View>
      ) : (
        <>
          {!isCompleted && <View>{renderTitle(currentIndex)}</View>}
          {reviewMode
            ? isCompleted
              ? renderCompleteScreen()
              : renderReviewStep()
            : isCompleted
              ? renderCompleteScreen()
              : renderStep(currentIndex)}
          <LessonBottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            isSkip={checkIsSkip(reviewMode ? reviewIndexes[reviewCurrent] : currentIndex)}
            isFalse={isFalse}
            onNextStep={handleNextStep}
            isLast={questions && currentIndex === questions.length - 1}
            description={getDescription(
              questions,
              isFalse,
              reviewMode ? reviewIndexes[reviewCurrent] : currentIndex,
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default LessonDetailScreen;
