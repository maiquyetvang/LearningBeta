import React from 'react';
import { View } from 'react-native';
import { useGetCourse, useGetLessonGroup } from '~/hooks/useGetLessonById';
import { useNextLesson } from '~/hooks/useNextLesson';
import { useLearningStore } from '~/stores/learning.store';
import { Text } from '../ui/text';
import LessonCard from './LessonCard';

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
    <View className="gap-3">
      <Text className="font-semibold  text-neutral-500 dark:text-neutral-300">Today Lesson</Text>
      <LessonCard lesson={lesson} onLearn={onLearn} onOverview={onOverview} />
    </View>
  );
};

export default TodayLesson;
