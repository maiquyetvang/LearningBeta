import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../components/ui/text';
import ProgressBar from '../../../components/common/ProgressBar';
import { useGetUserLearningStats } from '~/feature/lesson/hooks/use-get-user-learning-stats';
import { useGetCourses } from '~/feature/lesson/hooks/use-get-courses';
import { useNextLesson } from '~/hooks/useNextLesson';

const CourseHeader: React.FC = () => {
  const { data: userLearningStats } = useGetUserLearningStats();
  const courseId = userLearningStats?.current_course_id || '';
  const { data: course } = useGetCourses(courseId);
  const { progress } = useNextLesson(course);

  const isCompleted = progress === 100;

  if (!course) return null;

  return (
    <View className="gap-3">
      <View className="gap-3 justify-between items-center flex-row">
        <Text className="text-neutral-800 font-semibold dark:text-neutral-200">
          {course?.title?.toLocaleUpperCase()}
        </Text>
        <Text
          className={`py-1 px-2 rounded-md ${
            isCompleted
              ? 'text-success-500 bg-success-50 dark:bg-success-900'
              : 'text-primary bg-primary-50 dark:bg-primary-900'
          }`}
        >
          {isCompleted ? 'Completed' : 'Learning'}
        </Text>
      </View>
      <ProgressBar value={progress} />
    </View>
  );
};

export default CourseHeader;
