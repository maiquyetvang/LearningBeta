import React from "react";
import { Image, ImageSourcePropType, Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LessonImages } from "assets";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Text } from "../ui/text";
import { H4 } from "../ui/typography";
import ProgressBar from "../common/ProgressBar";
import { useLearningStore } from "~/stores/learning.store";
import { useGetCourse, useGetLessonGroup } from "~/hooks/useGetLessonById";
import { LessonGroup } from "~/types/lesson.type";
import { useNextLesson } from "~/hooks/useNextLesson";

type Lesson = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export default function TodayLesson({
  courseId,
  onLearn,
  onOverview,
}: {
  courseId: string;
  onLearn?: (id: string) => void;
  onOverview?: (id: string) => void;
}) {
  const { data: course } = useGetCourse(courseId);
  const { nextLesson, lessonGroups, progress } = useNextLesson(course);
  const { inProgressLesson, clearInProgressLesson, resetLearning } =
    useLearningStore();
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
}

const LessonCard: React.FC<{
  lesson: LessonGroup;
  onOverview?: (id: string) => void;
  onLearn?: (id: string) => void;
}> = ({ lesson, onLearn, onOverview }) => {
  const { saveInProgressLesson, inProgressLesson, clearInProgressLesson } =
    useLearningStore();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      {
        translateY: interpolate(1, [0, 1], [8, 0]),
      },
    ],
  }));
  // if (!inProgressLesson) {
  //   return <></>;
  // }

  const progress = inProgressLesson
    ? (inProgressLesson.progress.length / inProgressLesson.totalLesson) * 100
    : 0;

  return (
    <Animated.View style={animatedStyle}>
      {/* <Text>{JSON.stringify(inProgressLesson, null, 2)}</Text> */}
      <Pressable
        className='bg-neutral-50 dark:bg-neutral-900 rounded-lg'
        onPress={() => onOverview?.(lesson.id)}
      >
        {lesson.image && (
          <Image
            source={lesson.image}
            style={{
              width: "100%",
              aspectRatio: 39 / 28,
              height: undefined,
            }}
            className='rounded-t-lg'
          />
        )}
        <View className='p-3 gap-2'>
          <View className='gap-2  text-foreground'>
            <H4 className='text-foreground'>{lesson.title}</H4>
            <Text className='text-neutral-500'>{lesson.description}</Text>
          </View>
          <ProgressBar value={progress} />
          <Button
            onPress={() => onLearn?.(lesson.id)}
            variant={inProgressLesson ? "secondary" : undefined}
            className='w-full'
          >
            <Text>{inProgressLesson ? "Resume" : "Start Learning"}</Text>
          </Button>
        </View>
      </Pressable>
    </Animated.View>
  );
};
