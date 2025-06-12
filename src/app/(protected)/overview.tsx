import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '~/components/common/ProgressBar';
import PullToRefreshWrapper from '~/components/common/PullToRefreshWrapper';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useGetLesson } from '~/feature/lesson/hooks/use-get-lesson';
import { ChevronLeft } from '~/lib/icons/ChevronLeft';
import { useLocalLearningStore } from '~/stores/learning.store';

const OverviewScreen: React.FC = () => {
  const { id: lessonId } = useLocalSearchParams<{ id: string }>();
  const { data: lessonDetail, isLoading } = useGetLesson({ id: lessonId });
  const { inProgressLesson } = useLocalLearningStore();
  const [imageError, setImageError] = useState(false);

  const { currentCourse } = useLocalLearningStore();
  if (!currentCourse) return null;

  const handleLearn = () => {
    router.push({
      pathname: '/(protected)/(lesson)',
      params: {
        id: lessonId,
      },
    });
  };
  const progress = inProgressLesson
    ? (inProgressLesson.progress.filter((item) => !item.isFalse).length /
        inProgressLesson.totalLesson) *
      100
    : 0;
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(protected)/(_tabs)');
  };
  if (!lessonDetail && isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!lessonDetail) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">No lesson data available</Text>
      </SafeAreaView>
    );
  }
  console.log(JSON.stringify(lessonDetail, null, 2));
  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity className="px-5 mb-2 flex-row items-center gap-2" onPress={handleBack}>
        <ChevronLeft className="text-foreground" />
        <Text className="text-lg font-semibold">Home</Text>
      </TouchableOpacity>
      <PullToRefreshWrapper>
        {/* <Text>{JSON.stringify(lessonDetail, null, 2)}</Text> */}
        <View className="flex-1 px-5 pb-5 mt-2">
          {/* Header */}
          <View className="flex-row items-center gap-4 mb-4">
            {lessonDetail.image_url && !imageError && (
              <Image
                source={{ uri: lessonDetail.image_url }}
                style={{
                  width: 'auto',
                  aspectRatio: 39 / 28,
                  height: 100,
                }}
                onError={() => setImageError(true)}
              />
            )}

            <View className="flex-1 gap-3">
              <Text className="text-lg font-bold">{lessonDetail.title}</Text>
              <Text className="text-neutral-500">{lessonDetail.description}</Text>
              <ProgressBar value={progress} />
            </View>
          </View>
          {/* Lesson Target */}
          {lessonDetail.targets && lessonDetail.targets.length > 0 && (
            <View className="mb-4">
              <View className="flex-row">
                <Text className="bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1">
                  Lesson Target
                </Text>
                <View className="flex-1 h-1"></View>
              </View>
              {lessonDetail.targets.map((t, i) => (
                <Text key={i} className="ml-2 my-0.5">
                  • {t}
                </Text>
              ))}
            </View>
          )}

          {/* Vocabulary */}
          {lessonDetail.vocabulary && lessonDetail.vocabulary.length > 0 && (
            <View className="mb-4">
              <View className="flex-row">
                <Text className="bg-primary-50 dark:bg-primary-900 rounded text-primary font-semibold px-2 py-1 mb-1">
                  Vocabulary & Expression
                </Text>
                <View className="flex-1 h-1"></View>
              </View>
              {lessonDetail.vocabulary.map((v, i) => (
                <Text key={i} className="ml-2 my-0.5">
                  • {v}
                </Text>
              ))}
            </View>
          )}
          {/* Grammar */}
          {lessonDetail.grammar && lessonDetail.grammar.length > 0 && (
            <View className="mb-4 ">
              <View className="flex-row">
                <Text className="bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1">
                  Grammar
                </Text>
                <View className="flex-1 h-1"></View>
              </View>
              {lessonDetail.grammar.map((g, i) => (
                <Text key={i} className="ml-2 my-0.5">
                  • {g}
                </Text>
              ))}
            </View>
          )}
        </View>
      </PullToRefreshWrapper>
      <View className="px-5 pb-5">
        <Button className="bg-primary w-full" onPress={handleLearn}>
          <Text className="text-white font-semibold">Let&apos;s Learn</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OverviewScreen;
