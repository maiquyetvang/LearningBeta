import { AppImages } from 'assets';
import React from 'react';
import { Image, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useGetUserLearningStats } from '~/feature/lesson/hooks/use-get-user-learning-stats';
import { useStreakModal } from '~/contexts/StreakModalContext';
import { Text } from '../ui/text';

const Overall = () => {
  const { data: userLearningStats } = useGetUserLearningStats();
  const streakModal = useStreakModal();
  const prevStreak = React.useRef(userLearningStats?.streak_days);

  React.useEffect(() => {
    if (
      typeof userLearningStats?.streak_days === 'number' &&
      userLearningStats.streak_days > 0 &&
      prevStreak.current !== undefined &&
      userLearningStats.streak_days !== prevStreak.current
    ) {
      streakModal?.showStreak?.(userLearningStats.streak_days);
    }
    prevStreak.current = userLearningStats?.streak_days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLearningStats?.streak_days]);

  const totalLearningTime = userLearningStats?.total_learning_time || 0;
  const streakDays = userLearningStats?.streak_days || 0;

  const minute = Math.floor((totalLearningTime || 0) / 60000);
  const animatedMinute = useSharedValue(minute);

  React.useEffect(() => {
    animatedMinute.value = withTiming(minute, { duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute]);

  const animMinute = useSharedValue(0);
  React.useEffect(() => {
    animMinute.value = 0;
    animMinute.value = withTiming(1, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute]);

  const animatedMinuteStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + 0.9 * animMinute.value,
    transform: [
      {
        translateY: interpolate(animMinute.value, [0, 1], [10, 0]),
      },
    ],
  }));

  // --- Streak Days ---
  const animatedStreak = useSharedValue(streakDays);

  React.useEffect(() => {
    animatedStreak.value = withTiming(streakDays, { duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakDays]);

  const animStreak = useSharedValue(0);
  React.useEffect(() => {
    animStreak.value = 0;
    animStreak.value = withTiming(1, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakDays]);

  const animatedStreakStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + 0.9 * animStreak.value,
    transform: [
      {
        translateY: interpolate(animStreak.value, [0, 1], [10, 0]),
      },
    ],
  }));

  const animatedStreakText = useDerivedValue(() => Math.round(animatedStreak.value));

  const getStreakImage = (last_learned_date?: string | null) => {
    if (!last_learned_date) return AppImages.streak_lv1;
    const today = new Date();
    const learnedDate = new Date(last_learned_date);
    const isToday =
      learnedDate.getFullYear() === today.getFullYear() &&
      learnedDate.getMonth() === today.getMonth() &&
      learnedDate.getDate() === today.getDate();
    return isToday ? AppImages.streak_lv4 : AppImages.streak_lv1;
  };
  return (
    <View>
      <Text className="font-semibold  text-neutral-500 dark:text-neutral-300">Overall</Text>

      <View className="p-3 pb-2 mt-3 gap-3 items-center flex-row rounded-lg bg-success-50 dark:bg-success-900">
        <Image source={AppImages.chronometer} style={{ height: 40, width: 40 }} />
        <View className="justify-center">
          <Text className="text-success-500 font-semibold">Learning Time</Text>
          <View className="flex-row gap-1 items-start ">
            <Animated.View style={animatedMinuteStyle}>
              <Text>
                <Animated.Text
                  className="text-foreground"
                  style={{ fontSize: 20, fontWeight: 'bold' }}
                >
                  {minute < 1 ? Math.floor((totalLearningTime || 0) / 1000) : minute}
                </Animated.Text>
                <Text className="pt-[6px]">
                  {minute < 1 ? ` Sec` : minute > 1 ? ' Mins' : ' Min'}
                </Text>
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
      <View className="p-3 pb-3 mt-3 gap-3 items-center flex-row rounded-lg bg-primary-50 dark:bg-primary-900">
        <Image
          source={getStreakImage(userLearningStats?.last_learned_date)}
          style={{ height: 40, width: 40 }}
        />
        <View className="justify-center gap-1">
          <Text className="text-primary font-semibold">Streak Days</Text>
          <View className="flex-row gap-2 items-start ">
            <Animated.View style={animatedStreakStyle}>
              <Text>
                <Animated.Text
                  className="text-foreground"
                  style={{ fontSize: 20, fontWeight: 'bold' }}
                >
                  {animatedStreakText.value}
                </Animated.Text>
                <Text className="pt-[6px]">{animatedStreakText.value > 1 ? ' Days' : ' Day'}</Text>
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Overall;
