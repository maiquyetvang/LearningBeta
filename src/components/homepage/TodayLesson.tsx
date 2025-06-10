import React from "react";
import { Image, Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useGetCourse, useGetLessonGroup } from "~/hooks/useGetLessonById";
import { useNextLesson } from "~/hooks/useNextLesson";
import { useLearningStore } from "~/stores/learning.store";
import { LessonGroup } from "~/types/lesson.type";
import ProgressBar from "../common/ProgressBar";
import { AnimatedButton } from "../custom-ui/animate-button";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { H4 } from "../ui/typography";
import LessonCard from "./LessonCard";

const TodayLesson = ({
  courseId,
  onLearn,
  onOverview,
}: {
  courseId: string;
  onLearn?: (id: string) => void;
  onOverview?: (id: string) => void;
}) => {
  const { data: course } = useGetCourse(courseId);
  const { nextLesson } = useNextLesson(course);
  const { inProgressLesson } = useLearningStore();
  const currentLesson = inProgressLesson?.lessonId || nextLesson?.id;
  const { data: lesson } = useGetLessonGroup(currentLesson);
  if (!lesson) {
    return <></>;
  }
  return (
    <View className='gap-3'>
      <Text className='font-semibold  text-neutral-500 dark:text-neutral-300'>
        Today Lesson
      </Text>
      <LessonCard lesson={lesson} onLearn={onLearn} onOverview={onOverview} />
    </View>
  );
};

export default TodayLesson;
