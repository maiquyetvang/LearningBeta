import React from 'react';
import { View } from 'react-native';
import { useGetCourses } from '~/feature/lesson/hooks/use-get-courses';
import { useGetLesson } from '~/feature/lesson/hooks/use-get-lesson';
import { useGetUserLearningStats } from '~/feature/lesson/hooks/use-get-user-learning-stats';
import { useNextLesson } from '~/hooks/useNextLesson';
import { useLocalLearningStore } from '~/stores/learning.store';
import { Text } from '../ui/text';
import LessonCard from './LessonCard';

const TodayLesson = ({
  // courseId,
  onLearn,
  onOverview,
}: {
  // courseId: string;
  onLearn?: (id: string) => void;
  onOverview?: (id: string) => void;
}) => {
  const { data: userLearningStats } = useGetUserLearningStats();
  const courseId = userLearningStats?.current_course_id || '';
  const { data: course } = useGetCourses(courseId);
  const { nextLesson } = useNextLesson(course);
  const { inProgressLesson } = useLocalLearningStore();
  const currentLesson = inProgressLesson?.lessonId || nextLesson?.id;
  const { data: lesson } = useGetLesson({ id: currentLesson });
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
