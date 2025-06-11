import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '~/components/common/ProgressBar';
import PullToRefreshWrapper from '~/components/common/PullToRefreshWrapper';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useGetLessonGroup } from '~/hooks/useGetLessonById';
import { ChevronLeft } from '~/lib/icons/ChevronLeft';
import { useLearningStore } from '~/stores/learning.store';

const OverviewScreen: React.FC = () => {
  const { id: lessonId } = useLocalSearchParams<{ id: string }>();
  const { data: lesson, isLoading } = useGetLessonGroup(lessonId);
  const { inProgressLesson } = useLearningStore();

  const { currentCourse } = useLearningStore();
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
    ? (inProgressLesson.progress.length / inProgressLesson.totalLesson) * 100
    : 0;
  const handleBack = () => {
    router.replace('/(protected)/(_tabs)');
  };
  if (!lesson && isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">No lesson data available</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <PullToRefreshWrapper>
        <View className="flex-1 px-5 pb-5">
          {/* Header */}
          <TouchableOpacity className="mb-4 flex-row items-center gap-2" onPress={handleBack}>
            <ChevronLeft className="text-foreground" />
            <Text className="text-lg font-semibold">Home</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-4 mb-4">
            <Image
              source={lesson.image}
              style={{
                width: 'auto',
                aspectRatio: 39 / 28,
                height: 100,
              }}
            />

            <View className="flex-1 gap-3">
              <Text className="text-lg font-bold">{lesson.title}</Text>
              <Text className="text-neutral-500">{lesson.description}</Text>
              <ProgressBar value={progress} />
            </View>
          </View>
          {/* Lesson Target */}
          {lesson.targets && (
            <View className="mb-4">
              <Text className="bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1">
                Lesson Target
              </Text>
              {lesson.targets.map((t, i) => (
                <Text key={i} className="ml-2 my-0.5">
                  • {t}
                </Text>
              ))}
            </View>
          )}
          {/* Vocabulary */}
          {lesson.vocabulary && (
            <View className="mb-4">
              <Text className="bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1">
                Vocabulary & Expression
              </Text>
              {lesson.vocabulary.map((v, i) => (
                <Text key={i} className="ml-2 my-0.5">
                  • {v}
                </Text>
              ))}
            </View>
          )}
          {/* Grammar */}
          {lesson.grammar && (
            <View className="mb-8">
              <Text className="bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1">
                Grammar
              </Text>
              {lesson.grammar.map((g, i) => (
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
          <Text className="text-white font-semibold">Let's Learn</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OverviewScreen;
