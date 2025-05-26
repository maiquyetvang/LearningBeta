import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LessonImages } from "~/assets";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Text } from "../ui/text";
import { H4 } from "../ui/typography";

type Lesson = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};
const lesson: Lesson = {
  id: "1",
  title: "회사원이 아니에요",
  description: "I'm not a company employee",
  image: LessonImages[2],
};
export default function TodayLesson({}: {}) {
  return (
    <View className='gap-3'>
      <Text className='font-semibold  text-neutral-500'>Overall</Text>
      <View className=''>
        <LessonCard lesson={lesson} onPress={() => {}} />
      </View>
    </View>
  );
}

const LessonCard: React.FC<{
  lesson: Lesson;
  onPress: (id: string) => void;
}> = ({ lesson, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      {
        translateY: interpolate(1, [0, 1], [8, 0]),
      },
    ],
  }));

  const progress = 10;
  return (
    <Animated.View style={animatedStyle}>
      <View
        className='bg-neutral-50 rounded-lg'
        onTouchEnd={() => onPress(lesson.id)}
      >
        <Image
          source={lesson.image}
          style={{
            width: "100%",
            aspectRatio: 39 / 28,
            height: undefined,
            backgroundColor: "red",
          }}
          className='rounded-t-lg'
        />
        <View className='p-3 gap-2'>
          <View className='gap-2  text-foreground'>
            <H4 className='text-foreground'>{lesson.title}</H4>
            <Text className='text-neutral-500'>{lesson.description}</Text>
          </View>
          <View className='flex-row items-center flex-1 gap-2'>
            <Progress
              value={progress}
              className='bg-neutral-200 flex-1 h-2 '
              indicatorClassName='bg-primary'
            />
            <Text>{progress}%</Text>
          </View>
          <Button>
            <Text>Start Learning</Text>
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};
