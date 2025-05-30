import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PullToRefreshWrapper from "~/components/common/PullToRefreshWrapper";
import LessonOverview from "~/components/lesson/LessonOverview";
import { Text } from "~/components/ui/text";
import { useGetLessonGroup } from "~/hooks/useGetLessonById";
import { useNextLesson } from "~/hooks/useNextLesson";
import { useLearningStore } from "~/stores/learning.store";

const OverviewScreen: React.FC = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data, isLoading } = useGetLessonGroup(lessonId);

  const { currentCourse } = useLearningStore();
  if (!currentCourse) return null;
  const { isAllCompleted } = useNextLesson(currentCourse);

  const handleLearn = () => {
    console.log({ lessonIdlessonId: lessonId });
    router.push({
      pathname: "/(protected)/(lesson)",
      params: {
        lessonId,
      },
    });
  };
  if (!data && isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <Text className='text-lg font-semibold'>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!data) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <Text className='text-lg font-semibold'>No lesson data available</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className='flex-1'>
      <PullToRefreshWrapper>
        <LessonOverview lesson={data} onStart={handleLearn} />
      </PullToRefreshWrapper>
    </SafeAreaView>
  );
};

export default OverviewScreen;
