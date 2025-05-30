import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { router } from "expo-router";
import { LessonGroup } from "~/types/lesson.type";
import { useLearningStore } from "~/stores/learning.store";
import ProgressBar from "../common/ProgressBar";

export default function LessonOverview({
  lesson,
  onStart,
}: {
  lesson: LessonGroup;
  onStart: () => void;
}) {
  const { inProgressLesson } = useLearningStore();
  const progress = inProgressLesson
    ? (inProgressLesson.progress.length / inProgressLesson.totalLesson) * 100
    : 0;
  const handleBack = () => {
    router.replace("/(protected)/(_tabs)/(_home)");
  };
  return (
    <View className='flex-1 px-5 pb-5'>
      {/* Header */}
      <TouchableOpacity
        className='mb-4 flex-row items-center gap-2'
        onPress={handleBack}
      >
        <ChevronLeft className='text-foreground' />
        <Text className='text-lg font-semibold'>Home</Text>
      </TouchableOpacity>
      <View className='flex-row items-center gap-4 mb-4'>
        <Image
          source={lesson.image}
          style={{
            width: "auto",
            aspectRatio: 39 / 28,
            height: 100,
          }}
        />

        <View className='flex-1 gap-3'>
          <Text className='text-lg font-bold'>{lesson.title}</Text>
          <Text className='text-neutral-500'>{lesson.description}</Text>
          <ProgressBar value={progress} />
        </View>
      </View>
      {/* Lesson Target */}
      {lesson.targets && (
        <View className='mb-4'>
          <Text className='bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1'>
            Lesson Target
          </Text>
          {lesson.targets.map((t, i) => (
            <Text key={i} className='ml-2 my-0.5'>
              • {t}
            </Text>
          ))}
        </View>
      )}
      {/* Vocabulary */}
      {lesson.vocabulary && (
        <View className='mb-4'>
          <Text className='bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1'>
            Vocabulary & Expression
          </Text>
          {lesson.vocabulary.map((v, i) => (
            <Text key={i} className='ml-2 my-0.5'>
              • {v}
            </Text>
          ))}
        </View>
      )}
      {/* Grammar */}
      {lesson.grammar && (
        <View className='mb-8'>
          <Text className='bg-primary-50 dark:bg-primary-900 text-primary font-semibold px-2 py-1 rounded mb-1'>
            Grammar
          </Text>
          {lesson.grammar.map((g, i) => (
            <Text key={i} className='ml-2 my-0.5'>
              • {g}
            </Text>
          ))}
        </View>
      )}
      {/* Button */}
      <View className='mt-auto'>
        <Button className='bg-primary w-full' onPress={onStart}>
          <Text className='text-white font-semibold'>Let's Learn</Text>
        </Button>
      </View>
    </View>
  );
}
