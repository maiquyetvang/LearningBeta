import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { Card } from '~/components/ui/card';
import { Image } from 'expo-image';
import React from 'react';
import { ScreenHeader } from '~/components/screen-header';
import { ScreenView } from '~/components/screen-view';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const TOPICS = [
  {
    id: 'traveling',
    title: 'Traveling',
    icon: require('~/assets/images/things/airplane.png'),
    progress: 0,
  },
  {
    id: 'hobbies',
    title: 'Hobbies & Free Time',
    icon: require('~/assets/images/things/gamepad.png'),
    progress: 0,
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    icon: require('~/assets/images/things/clock.png'),
    progress: 0,
  },
  {
    id: 'shopping-food',
    title: 'Shopping & Food',
    icon: require('~/assets/images/things/burger.png'),
    progress: 0,
  },
  {
    id: 'work-study',
    title: 'Work & Study',
    icon: require('~/assets/images/things/briefcase.png'),
    progress: 0,
  },
  {
    id: 'family-friends',
    title: 'Family & Friends',
    icon: require('~/assets/images/things/family.png'),
    progress: 0,
  },
];

function TopicCard({ topic, onPress }: { topic: (typeof TOPICS)[0]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-1">
      <Card className="h-[185px] mx-2 mb-4 shadow-none border-primary-100 dark:border-primary-900">
        <View className="flex-1 items-center justify-center p-4">
          <View className="mb-4">
            <Image
              source={topic.icon}
              style={{
                width: 72,
                height: 72,
              }}
              contentFit="contain"
            />
          </View>
          <Text className="text-center text-base font-medium text-foreground mb-4">
            {topic.title}
          </Text>
          <View className="flex-row justify-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full',
                  index < topic.progress ? 'bg-green-500' : 'bg-gray-300',
                )}
              />
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export default function ConversationScreen() {
  const handleTopicPress = (topicId: string) => {
    console.log('Topic pressed:', topicId);
    // Handle navigation to topic conversation
  };

  const handleBackPress = () => {
    console.log('Back pressed');
    // Handle navigation back
  };

  const handleLevelChange = (direction: 'prev' | 'next') => {
    console.log('Level change:', direction);
    // Handle level change
  };

  return (
    <ScreenView>
      {/* Header */}
      <ScreenHeader title="Conversation" />

      {/* Level Selector */}
      <View className="flex-row items-center justify-center py-3 bg-neutral-50 dark:bg-neutral-900">
        <Pressable hitSlop={16} onPress={() => handleLevelChange('prev')} className="p-2">
          <ChevronLeft size={20} className="text-orange-500" />
        </Pressable>

        <View className="mx-8">
          <Text className="text-center text-orange-500 font-bold text-lg tracking-wider">
            BEGINNER
          </Text>
        </View>

        <Pressable onPress={() => handleLevelChange('next')} className="p-2">
          <ChevronRight size={20} className="text-orange-500" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-center text-gray-600 text-base mb-8">Select a topic you like</Text>

        {/* Topics Grid */}
        <View className="pb-8">
          {Array.from({ length: Math.ceil(TOPICS.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row">
              {TOPICS.slice(rowIndex * 2, rowIndex * 2 + 2).map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onPress={() => handleTopicPress(topic.id)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenView>
  );
}
