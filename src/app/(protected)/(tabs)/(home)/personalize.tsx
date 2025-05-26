import { router } from "expo-router";
import React, { useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import StepProgressBar from "~/src/components/custom-ui/progress";
import ListeningLesson from "~/src/components/lesson/ListeningLesson";
import MappingLesson from "~/src/components/lesson/MappingLesson";
import SelectLesson from "~/src/components/lesson/SelectLesson";
import SimpleSentenceLesson from "~/src/components/lesson/SimpleSentenceLesson";
import SingleChooseLesson from "~/src/components/lesson/SingleChooseLesson";
import VoiceMatch from "~/src/components/lesson/VoiceLesson";
import WriteOnlyWordLesson from "~/src/components/lesson/WriteOnlyWordLesson";
import WriteWordLesson from "~/src/components/lesson/WriteWordLesson";
import { AnimatedScreenWrapper } from "~/src/components/login/AnimatedScreenWrapper";
import PersonalizeStepScreen from "~/src/components/personalize/PersonalizeStepScreen";
import { Text } from "~/src/components/ui/text";
import { H2, H3 } from "~/src/components/ui/typography";
import { ELessonType } from "~/src/types/lesson.type";

export type PersonalizeStep =
  | { type: "welcome" }
  | { type: "level"; value: string }
  | { type: "purpose"; value: string }
  | { type: "duration"; value: string }
  | { type: "start"; value: string };

export const personalizeData: PersonalizeStep[] = [
  {
    type: "welcome",
  },
  {
    type: "level",
    value: "",
  },
  {
    type: "purpose",
    value: "",
  },
  {
    type: "duration",
    value: "",
  },
  {
    type: "start",
    value: "",
  },
];

export const personalizeStepDetail = [
  {
    type: "welcome",
    title: "Welcome!",
    description:
      "Please answer a few questions so that I can help you to personalize your learning path.",
    button: "Start Personalize",
  },
  {
    type: "level",
    title: "How well can you use Korean?",
    options: [
      {
        label: "BEGINNER",
        description: "I'm a new learner",
      },
      {
        label: "INTERMEDIATE",
        description: "I'm familiar with Korean",
      },
      {
        label: "ADVANCE",
        description: "I can use Korean fluently",
      },
    ],
  },
  {
    type: "purpose",
    title: "Your purpose of learning Korean is?",
    options: [
      { label: "Study Supports", subDescription: "📖" },
      { label: "Work Supports", subDescription: "💼" },
      { label: "Travelling", subDescription: "✈️" },
      { label: "Hobby", subDescription: "❤️" },
      { label: "Others", subDescription: "💬" },
    ],
  },
  {
    type: "duration",
    title: "Which duration is suitable for you to learn Korean per day?",
    options: [
      { label: "5 mins / day", subDescription: "Easiest" },
      { label: "10 mins / day", subDescription: "Easy" },
      { label: "15 mins / day", subDescription: "Medium" },
      { label: "20 mins / day", subDescription: "Hard" },
      { label: "30 mins / day", subDescription: "Extremely Hard" },
    ],
  },
  {
    type: "start",
    title: "Finally! Where would you like to start your learning path?",
    options: [
      {
        label: "START FROM BEGINNING",
        description: "Learn from the beginning of the Self-Learning Course",
      },
      {
        label: "TAKE A TEST",
        description: "Let’s us identify the best starting point for you",
        recommend: true,
      },
    ],
  },
];

const PersonalizeScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [personalizeValues, setPersonalizeValues] = useState<
    Record<string, string>
  >({});

  const renderTitle = (index: number) => {
    if (index >= personalizeStepDetail.length || index === 0) return <></>;
    const step = personalizeStepDetail[index];
    if (!step.title) return null;
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
        <View className='flex-1 px-5 py-5 rounded-3xl shadow-popover shadow-sm bg-neutral-50 dark:bg-neutral-900'>
          <AnimatedScreenWrapper>
            <Text className='text-xl font-medium text-foreground'>
              {step.title}
            </Text>
          </AnimatedScreenWrapper>
        </View>
      </View>
    );
  };

  const handlePersonalizeNext = (value: string) => {
    setPersonalizeValues((prev) => ({
      ...prev,
      [personalizeStepDetail[currentIndex].type]: value,
    }));
    setCurrentIndex((prev) => prev + 1);
    if (currentIndex === personalizeStepDetail.length - 1) {
      if (value === "TAKE A TEST") {
        router.replace("/(protected)/(tabs)/(home)/details?lessonId=0");
      } else if (value === "START FROM BEGINNING") {
        router.replace("/(protected)/(tabs)/(home)");
      }
      return;
    }
  };
  const handleUndo = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const renderStep = (
    index: number,
    personalizeValues: Record<string, string>
  ) => {
    if (index >= personalizeStepDetail.length) return null;
    const value = personalizeValues[personalizeStepDetail[index].type];
    return (
      <PersonalizeStepScreen
        stepIndex={index}
        value={value}
        onNext={handlePersonalizeNext}
        onPrevious={handleUndo}
      />
    );
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 gap-5 p-5'>
        {currentIndex !== 0 && (
          <View className='gap-5'>
            <H3>Level Test</H3>
            <StepProgressBar
              currentIndex={currentIndex - 1}
              length={personalizeStepDetail.length - 1}
            />
          </View>
        )}
        <>{renderTitle(currentIndex)}</>
        <>{renderStep(currentIndex, personalizeValues)}</>
      </View>
    </SafeAreaView>
  );
};
export default PersonalizeScreen;
