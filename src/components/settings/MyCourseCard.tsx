import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useNextLesson } from '~/hooks/useNextLesson';
import { useLearningStore } from '~/stores/learning.store';
import ProgressBar from '../common/ProgressBar';

export default function MyCourseCard() {
  const { currentCourse: course } = useLearningStore();
  const { progress, isAllCompleted } = useNextLesson(course);

  if (!course) return null;
  return (
    <View className="p-3 rounded-lg gap-3 bg-neutral-50 dark:bg-neutral-900">
      <View className="gap-3 justify-between items-center flex-row">
        <Text className="text-lg text-neutral-800 font-semibold dark:text-neutral-200">
          {course.title}
        </Text>
        <Text
          className={` py-1 px-2 rounded-md ${
            isAllCompleted
              ? 'text-success-500 bg-success-50 dark:bg-success-900'
              : 'text-primary bg-primary-50 dark:bg-primary-900'
          }`}
        >
          {isAllCompleted ? 'Completed' : 'Learning'}
        </Text>
      </View>
      <ProgressBar value={progress} />
    </View>
  );
}
