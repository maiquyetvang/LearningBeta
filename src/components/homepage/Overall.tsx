import React from "react";
import { Image, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppImages } from "~/assets";
import { Text } from "../ui/text";

export default function Overall({
  learningTime: learningTime_ = 0,
}: {
  learningTime?: number;
}) {
  const prevMinute = React.useRef(0);
  const [minute, setMinute] = React.useState(0);
  const [learningTime, setLearningTime] = React.useState(() => learningTime_);

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLearningTime((pre) => (pre || 0) + 60);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  React.useEffect(() => {
    setLearningTime(learningTime_);
  }, [learningTime_]);

  React.useEffect(() => {
    const minutes = Math.floor(((learningTime || 0) % 3600) / 60);
    if (minutes !== prevMinute.current) {
      setMinute(minutes);
      prevMinute.current = minutes;
    }
  }, [learningTime]);

  const animatedMinute = useSharedValue(minute);

  React.useEffect(() => {
    animatedMinute.value = withTiming(minute, { duration: 400 });
  }, [minute]);

  const anim = useSharedValue(0);
  React.useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, { duration: 500 });
  }, [minute]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + 0.9 * anim.value,
    transform: [
      {
        translateY: interpolate(anim.value, [0, 1], [10, 0]),
      },
    ],
  }));

  const animatedText = useDerivedValue(() => Math.round(animatedMinute.value));

  return (
    <View>
      <Text className='font-semibold  text-neutral-500'>Overall</Text>
      <View className='p-3 pb-2 mt-3 gap-3 items-center flex-row rounded-lg bg-success-50 dark:bg-success-900'>
        <Image
          source={AppImages.chronometer}
          style={{ height: 40, width: 40 }}
        />
        <View className='justify-center'>
          <Text className='text-success font-semibold'>Learning Time</Text>
          <View className='flex-row gap-2 items-start '>
            <Animated.View style={animatedStyle}>
              <Animated.Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#258124" }}
              >
                {animatedText.value}
              </Animated.Text>
            </Animated.View>
            <Text className='pt-[8.5px]'>Min</Text>
          </View>
        </View>
      </View>
      <View className='p-3 pb-2 mt-3 gap-3 items-center flex-row rounded-lg bg-primary-50 dark:bg-primary-900'>
        <Image source={AppImages.fire} style={{ height: 40, width: 40 }} />
        <View className='justify-center'>
          <Text className='text-primary font-semibold'>Streak Days</Text>
          <View className='flex-row text- gap-2 items-start '>
            <Animated.View style={animatedStyle}>
              <Animated.Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#EA8934" }}
              >
                {animatedText.value}
              </Animated.Text>
            </Animated.View>
            <Text className='pt-[8.5px]'>Day</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
