import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import { Button } from "~/components/ui/button";

const LessonDetailScreen: React.FC = () => {
  const handlePushDetail = (index: string) => {
    router.push({
      pathname: "/details",
      params: {
        lessonId: index,
      },
    });
  };
  const renderRandomTitle = () => {
    const randomTitle = Math.random().toString(36).substring(2, 7);
    return randomTitle.charAt(0).toUpperCase() + randomTitle.slice(1);
  };
  const renderRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View className='gap-3   px-4'>
          {Array.from({ length: 20 }).map((_, index) => {
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
