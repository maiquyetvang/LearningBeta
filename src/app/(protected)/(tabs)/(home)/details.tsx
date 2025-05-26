import BottomSheet from "@gorhom/bottom-sheet";
import { createAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StepProgressBar, {
  ProgressStep,
} from "~/src/components/custom-ui/progress";
import ThemeIcon from "~/src/components/Icon";
import ListeningLesson from "~/src/components/lesson/ListeningLesson";
import MappingLesson from "~/src/components/lesson/MappingLesson";
import SelectLesson from "~/src/components/lesson/SelectLesson";
import SimpleSentenceLesson from "~/src/components/lesson/SimpleSentenceLesson";
import SingleChooseLesson from "~/src/components/lesson/SingleChooseLesson";
import VoiceMatch from "~/src/components/lesson/VoiceLesson";
import WriteOnlyWordLesson from "~/src/components/lesson/WriteOnlyWordLesson";
import WriteWordLesson from "~/src/components/lesson/WriteWordLesson";
import { Text } from "~/src/components/ui/text";
import { useGetLessonById } from "~/src/hooks/useGetLessonById";
import { ELessonType } from "~/src/types/lesson.type";
import { initializeTtsListeners } from "~/src/utils/ttsListeners";
import CompleteScene from "./_components/CompleteScene";
import LessonBottomSheet from "./_components/LessonBottomSheet";

const successAudio = require("~/assets/sounds/success.mp3");
const errorAudio = require("~/assets/sounds/error.mp3");

const LessonDetailScreen: React.FC = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data, isLoading } = useGetLessonById(lessonId);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean | undefined>();
  const playerSuccess = createAudioPlayer(successAudio);
  const playerError = createAudioPlayer(errorAudio);
  const [isFalse, setIsFalse] = useState<boolean | undefined>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setIsFalse(undefined);
  }, []);

  useEffect(() => {
    if (data && currentIndex === data.length) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [currentIndex, data]);

  const handleNextStep = () => {
    closeBottomSheet();
    setDisabled(false);
    setCurrentIndex((prevStep) => {
      return prevStep + 1;
    });
  };
  const handleSuccess = useCallback(
    (isFalse?: boolean) => {
      setProgress((prev) => {
        const updated = prev.filter((step) => step.index !== currentIndex);
        return [...updated, { index: currentIndex, isFalse }];
      });
      setIsFalse(isFalse);
      openBottomSheet();
      setDisabled(true);
      if (!isFalse) {
        playerSuccess.play();
      } else {
        playerError.play();
      }
    },
    [data, currentIndex]
  );
  useEffect(() => {
    initializeTtsListeners();

    setTimeout(() => {
      // or Tts.speak(message)
    }, 1000);
  }, []);
  const handleReset = () => {
    setCurrentIndex(0);
    // setProgress(0);
    // setCurrentStep(steps[0]);
    router.back();
    // router.replace("/(protected)/(tabs)/(home)");
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const lessonTitleMap: Record<ELessonType, string> = {
    [ELessonType.Voice]: "Read out the sentence below",
    [ELessonType.Sentence]: "Translate this sentence",
    [ELessonType.Select]: "Complete the sentence below",
    [ELessonType.SingleChoose]: "Choose the right translation",
    [ELessonType.Listening]: "Choose the right answer for what you heard",
    [ELessonType.WriteOnlyWord]: "Write the right answer for what you heard",
    [ELessonType.WriteWord]: "Translate this sentence",
    [ELessonType.Mapping]: "Match the correct pairs",
  };

  const renderTitle = (index: number) => {
    if (!data || index >= data.length) return null;
    const text = lessonTitleMap[data[index].type] || "";
    return (
      <View
        key={index}
        className='flex-row w-full gap-2 items-center justify-center'
      >
        <Image
          source={require("~/assets/images/small-italic-icon.png")}
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
    [ELessonType.Voice]: VoiceMatch,
    [ELessonType.Select]: SelectLesson,
    [ELessonType.Sentence]: SimpleSentenceLesson,
    [ELessonType.SingleChoose]: SingleChooseLesson,
    [ELessonType.Listening]: ListeningLesson,
    [ELessonType.WriteOnlyWord]: WriteOnlyWordLesson,
    [ELessonType.WriteWord]: WriteWordLesson,
    [ELessonType.Mapping]: MappingLesson,
  };

  const renderStep = (index: number) => {
    if (!data || index >= data.length) return null;
    const LessonComponent = lessonComponentMap[data[index].type];
    if (!LessonComponent) return null;
    return (
      <LessonComponent
        key={index}
        value={data[index]}
        onSuccess={handleSuccess}
        disabled={disabled}
      />
    );
  };

  const getResultColor = (
    correctCount: number,
    totalCount: number
  ): string | undefined => {
    if (!totalCount) return;
    const ratio = correctCount / totalCount;
    if (ratio >= 0.8) return "text-green-500";
    if (ratio >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <SafeAreaView className='flex-1 flex h-full absolute gap-5 px-4 '>
      <View className='gap-2'>
        <View className='gap-2 w-full flex-row items-center justify-between'>
          <TouchableOpacity onPress={handleReset}>
            <ThemeIcon Icon={X} size={28} />
          </TouchableOpacity>
          <StepProgressBar
            currentIndex={currentIndex}
            progressStep={progress}
            length={data?.length}
          />
        </View>
      </View>
      {/* <ThemeToggle /> */}
      <View>{renderTitle(currentIndex)}</View>
      {isCompleted ? (
        <CompleteScene progress={progress} />
      ) : (
        <>{renderStep(currentIndex)}</>
      )}
      <LessonBottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        isFalse={isFalse}
        onNextStep={handleNextStep}
        isLast={data && currentIndex === data.length - 1}
        description={
          data && isFalse && data[currentIndex]
            ? `Correct answer: ${data[currentIndex].value.answer || data[currentIndex].value.answers?.join(" ")}`
            : ""
        }
      />
    </SafeAreaView>
  );
};

export default LessonDetailScreen;
