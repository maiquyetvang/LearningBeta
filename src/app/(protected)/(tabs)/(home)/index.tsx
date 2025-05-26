import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LearningPath from "~/src/components/homepage/LearningPath";
import Overall from "~/src/components/homepage/Overall";
import TodayLesson from "~/src/components/homepage/TodayLesson";
import { Button } from "~/src/components/ui/button";

const LessonDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const handlePushDetail = (index: string) => {
    router.push({
      pathname: "/details",
      params: {
        lessonId: index,
      },
    });
  };

  const renderRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };
  return (
    <SafeAreaView className='flex-1' style={{ paddingTop: insets.top }}>
      <ScrollView>
        <View className='gap-5 p-5'>
          <Overall />
          <TodayLesson />
          <LearningPath />
          {Array.from({ length: 0 }).map((_, index) => {
            const randomColor = renderRandomColor();
            return (
              <View
                key={index}
                className='border border-neutral-500 gap-2 flex-row items-center p-4 rounded-2xl'
              >
                <View
                  className='rounded-full h-20 w-20'
                  style={{
                    backgroundColor: randomColor,
                  }}
                />
                <View className='gap-2 text-foreground'>
                  <Text className='text-foreground'>{randomColor}</Text>
                  <Button
                    variant='outline'
                    onPress={() => handlePushDetail(index.toString())}
                  >
                    <Text className='text-foreground'>Learn</Text>
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LessonDetailScreen;
