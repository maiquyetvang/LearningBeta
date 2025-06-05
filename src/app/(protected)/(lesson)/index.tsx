import BottomSheet from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StepProgressBar, { ProgressStep } from "~/components/custom-ui/progress";
import ThemeIcon from "~/components/Icon";
import ListeningLesson from "~/components/lesson/ListeningLesson";
import MappingLesson from "~/components/lesson/MappingLesson";
import SelectLesson from "~/components/lesson/SelectLesson";
import SimpleSentenceLesson from "~/components/lesson/SimpleSentenceLesson";
import SingleChooseImageLesson from "~/components/lesson/SingleChooseImageLesson";
import SingleChooseLesson from "~/components/lesson/SingleChooseLesson";
import SpeakingLesson from "~/components/lesson/SpeakingLesson";
import WriteOnlyWordLesson from "~/components/lesson/WriteOnlyWordLesson";
import WriteWordLesson from "~/components/lesson/WriteWordLesson";
import { Text } from "~/components/ui/text";
import { useGetLessonGroup } from "~/hooks/useGetLessonById";
import { useLearningStore } from "~/stores/learning.store";
import { ELessonType, Lesson } from "~/types/lesson.type";
import { playResultSound } from "~/utils/playSound";
import CompleteLesson from "./_components/CompleteLesson";
import CompleteLevelTest from "./_components/CompleteLevelTest";
import LessonBottomSheet from "./_components/LessonBottomSheet";
import ReviewNotCorrectLesson from "./_components/ReviewNotCorrectLesson";

const LessonDetailScreen: React.FC = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const queryClient = useQueryClient();
  const isLevelTest = lessonId === "level-test";
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    totalLearningTime,
    streakDays,
    markLessonAsLearned,
    learnedLessons,
    saveInProgressLesson,
    inProgressLesson,
    clearInProgressLesson,
    isAudioDisabled,
    isSpeechDisabled,
    setAudioDisabled,
    setSpeechDisabled,
    addLearningTime,
  } = useLearningStore();

  const { data: lessonGroup } = useGetLessonGroup(lessonId);
  const data = lessonGroup?.lessons;

  const [currentIndex, setCurrentIndex] = useState<number>(
    inProgressLesson?.lessonId === lessonId
      ? inProgressLesson?.currentIndex || 0
      : 0
  );
  const [progress, setProgress] = useState<ProgressStep[]>(
    inProgressLesson?.lessonId === lessonId
      ? inProgressLesson?.progress || []
      : []
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
    closeBottomSheet();
    setDisabled(false);
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
    (isFalse?: boolean, isSkip?: boolean) => {
      const now = Date.now();
      const duration = now - stepStartTime;
      const index = reviewMode ? reviewIndexes[reviewCurrent] : currentIndex;
      addLearningTime(duration);
      setProgress((prev) => {
        const exists = prev.some((step) => step.index === index);
        let updated;
        if (exists) {
          updated = prev.map((step) =>
            step.index === index ? { ...step, isFalse, duration } : step
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
    [
      data,
      currentIndex,
      stepStartTime,
      reviewCurrent,
      reviewMode,
      reviewIndexes,
    ]
  );
  const checkIsSkip = (currentIndex: number) => {
    const type = data && data[currentIndex]?.type;
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
      router.replace("/(protected)/(_tabs)/(_home)");
    }
  };
  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const lessonTitleMap: Record<ELessonType, string> = {
    [ELessonType.Speaking]: "Read out the sentence below",
    [ELessonType.Sentence]: "Translate this sentence",
    [ELessonType.Select]: "Complete the sentence below",
    [ELessonType.SingleImageChoose]: "Choose the right translation",
    [ELessonType.SingleChoose]: "Choose the right translation",
    [ELessonType.Listening]: "Choose the right answer for what you heard",
    [ELessonType.WriteOnlyWord]: "Write the right answer for what you heard",
    [ELessonType.WriteWord]: "Translate this sentence",
    [ELessonType.Mapping]: "Match the correct pairs",
  };

  const renderTitle = (index: number) => {
    if (!data || index >= data.length || !data[index]) return null;
    const text = lessonTitleMap[data[index].type];
    return (
      <View
        key={index}
        className='flex-row w-full gap-2 items-center justify-center'
      >
        <Image
          source={require("assets/images/small-italic-icon.png")}
          style={{ width: 52, height: 60 }}
          resizeMode='contain'
        />
        <View className='flex-1 px-5 py-3 rounded-full shadow-popover shadow-sm bg-neutral-50 dark:bg-neutral-900'>
          <Text className='text-md font-medium text-foreground'>{text}</Text>
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
    if (!data || index >= data.length || !data[index]) return null;
    const LessonComponent = lessonComponentMap[data[index].type];
    if (!LessonComponent) return null;
    return (
      <LessonComponent
        key={index}
        value={data[index]}
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
      !data
    )
      return null;
    const index = reviewIndexes[reviewCurrent];
    if (index === undefined || !data[index]) return null;
    const LessonComponent = lessonComponentMap[data[index].type];
    if (!LessonComponent) return null;
    return (
      <LessonComponent
        key={index}
        value={data[index]}
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
    const incorrectIndexes = progress
      .filter((p) => p.isFalse)
      .map((p) => p.index);
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
    if (data && currentIndex === data.length) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [currentIndex, data, reviewCurrent, reviewIndexes]);

  // Check if the lesson is skipped
  useEffect(() => {
    if (checkIsSkip(reviewMode ? reviewIndexes[reviewCurrent] : currentIndex)) {
      handleSuccess(true, true);
      handleNextStep();
    }
  }, [currentIndex, reviewCurrent]);

  useEffect(() => {
    return () => {
      setAudioDisabled(false);
      setSpeechDisabled(false);
    };
  }, [lessonId, reviewMode]);

  //Handle save completed lesson
  useEffect(() => {
    if (
      isCompleted &&
      lessonId &&
      (isLevelTest || !progress.some((p) => p.isFalse))
    ) {
      // const duration = progress.reduce(
      //   (acc, step) => acc + (step.duration || 0),
      //   0
      // );
      const correctAnswers = progress.filter((p) => !p.isFalse).length;
      const totalQuestions = progress.length;
      const courseId = lessonGroup?.courseId;

      queryClient.invalidateQueries({
        queryKey: ["completedUnits", courseId],
      });
      markLessonAsLearned(
        lessonId,
        correctAnswers,
        totalQuestions,
        courseId
      );
      clearInProgressLesson();
    }
  }, [isCompleted, lessonId, progress]);

  // handle saving in-progress lesson
  useEffect(() => {
    if (lessonId && data && !isCompleted) {
      saveInProgressLesson({
        lessonId,
        currentIndex: progress.length,
        progress,
        totalLesson: data.length,
        reviewIndexes,
      });
    }
  }, [lessonId, currentIndex, progress, isCompleted, reviewIndexes]);

  useEffect(() => {
    if (
      inProgressLesson?.progress &&
      data &&
      inProgressLesson?.progress.length === data?.length &&
      inProgressLesson.progress.length > 0
    ) {
      handleReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (
    data: Lesson[],
    isFalse: boolean | undefined,
    currentIndex: number
  ) => {
    if (data && isFalse && data[currentIndex]) {
      if (data[currentIndex].type === ELessonType.Mapping) {
        return data[currentIndex].value.selectors?.reduce(
          (acc, selector, idx) => {
            return (
              acc +
              `\n${idx + 1}. ${selector} - ${data[currentIndex].value.answers?.[idx] || "No answer"}`
            );
          },
          "Correct answer: "
        );
        // return "Please try again to match the correct pairs.";
      }
      const answer =
        data[currentIndex].value.answer ||
        data[currentIndex].value.answers?.join(" ");
      return `Correct answer: ${answer}`;
    }
    return "Great job!";
  };

  return (
    <SafeAreaView className='flex-1 gap-5 px-5 pb-5'>
      <View className='gap-2'>
        <View className='gap-2 w-full flex-row items-center justify-between '>
          <TouchableOpacity onPress={handleReset}>
            <ThemeIcon Icon={X} size={28} />
          </TouchableOpacity>
          <StepProgressBar
            currentIndex={
              reviewMode
                ? reviewCurrent < reviewIndexes.length
                  ? reviewIndexes[reviewCurrent]
                  : data?.length
                : currentIndex
            }
            progressStep={progress}
            length={data?.length}
          />
        </View>
      </View>

      {!data || data.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-lg font-semibold'>No lessons available</Text>
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
            isSkip={checkIsSkip(
              reviewMode ? reviewIndexes[reviewCurrent] : currentIndex
            )}
            isFalse={isFalse}
            onNextStep={handleNextStep}
            isLast={data && currentIndex === data.length - 1}
            description={getDescription(
              data,
              isFalse,
              reviewMode ? reviewIndexes[reviewCurrent] : currentIndex
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default LessonDetailScreen;
