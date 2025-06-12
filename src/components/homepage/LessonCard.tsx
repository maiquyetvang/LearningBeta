import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { LessonWithParsedContent } from '~/feature/lesson/hooks/use-get-lesson';
import { useLocalLearningStore } from '~/stores/learning.store';
import ProgressBar from '../common/ProgressBar';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { H4 } from '../ui/typography';

const LessonCard: React.FC<{
  lesson: LessonWithParsedContent;
  onOverview?: (id: string) => void;
  onLearn?: (id: string) => void;
}> = ({ lesson, onLearn, onOverview }) => {
  const { inProgressLesson } = useLocalLearningStore();
  const [imageError, setImageError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      {
        translateY: interpolate(1, [0, 1], [8, 0]),
      },
    ],
  }));

  const progress = inProgressLesson
    ? (inProgressLesson.progress.filter((item) => !item.isFalse).length /
        inProgressLesson.totalLesson) *
      100
    : 0;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className="bg-neutral-50 dark:bg-neutral-900 rounded-lg"
        onPress={() => onOverview?.(lesson.id)}
      >
        {lesson.image_url && !imageError && (
          <Image
            source={{ uri: lesson.image_url }}
            style={{
              width: '100%',
              aspectRatio: 39 / 28,
              height: undefined,
            }}
            className="rounded-t-lg"
            onError={() => setImageError(true)}
          />
        )}
        <View className="p-3 gap-2">
          <View className="gap-2  text-foreground">
            <H4 className="text-foreground">{lesson.title}</H4>
            <Text className="text-neutral-500">{lesson.description}</Text>
          </View>
          <ProgressBar value={progress} />
          <Button
            onPress={() => onOverview?.(lesson.id)}
            variant={inProgressLesson ? 'secondary' : undefined}
            className="w-full"
          >
            <Text>{inProgressLesson ? 'Resume' : 'Start Learning'}</Text>
          </Button>
        </View>
      </Pressable>
    </Animated.View>
  );
};
export default LessonCard;
