import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PullToRefreshWrapper from '~/components/common/PullToRefreshWrapper';
import LearningPath from '~/components/homepage/LearningPath';
import Overall from '~/components/homepage/Overall';
import TodayLesson from '~/components/homepage/TodayLesson';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const handlePushDetail = (index: string) => {
    router.push({
      pathname: '/(protected)/(lesson)',
      params: {
        id: index,
      },
    });
  };
  const handlePushOverview = (index: string) => {
    router.push({
      pathname: '/(protected)/overview',
      params: {
        id: index,
      },
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);
  const courseId = 'course-1';
  return (
    <SafeAreaView className="flex-1" style={{ paddingTop: insets.top }}>
      <PullToRefreshWrapper onRefresh={onRefresh} refreshing={refreshing}>
        <View className="gap-5 relative p-5 pt-0">
          <Overall />
          <TodayLesson
            courseId={courseId}
            onLearn={handlePushDetail}
            onOverview={handlePushOverview}
          />
          <LearningPath
            courseId={courseId}
            onLearn={handlePushDetail}
            onReview={handlePushDetail}
          />
        </View>
      </PullToRefreshWrapper>
    </SafeAreaView>
  );
};

export default HomeScreen;
