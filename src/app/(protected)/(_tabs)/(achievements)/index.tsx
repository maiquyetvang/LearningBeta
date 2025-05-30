import { Check, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressBar from "~/components/common/ProgressBar";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import { Badge, useAchievements } from "~/hooks/useAchievements";

const Achievements = () => {
  const { badges, percent } = useAchievements();
  const [selectedItem, setSelectedItem] = useState<Badge | undefined>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleSelectBadge = (item: Badge) => {
    setSelectedItem(item);
    setDialogVisible(true);
  };

  const renderItem = ({ item }: { item: Badge; index: number }) => {
    const isDone = item.progress >= item.total;

    return (
      <Pressable
        onPress={() => handleSelectBadge(item)}
        className='flex-row bg-neutral-50 dark:bg-neutral-900 items-center gap-3 p-3 mb-3  rounded-lg'
      >
        <Image
          source={item.icon}
          style={{
            width: 86,
            height: 96,
            opacity: isDone ? 1 : 0.3,
          }}
        />
        <View className='flex-1 gap-2'>
          <Text className='font-semibold text-lg'>{item.name}</Text>
          <Text className='text-neutral-500'>{item.desc}</Text>
          <View className='flex-row items-center gap-3 mt-1'>
            <Progress
              value={Math.round((item.progress / item.total) * 100)}
              className='h-3 flex-1 bg-neutral-200 dark:bg-neutral-800'
              indicatorClassName='bg-success'
            />
            <Text className='font-semibold'>
              {Math.min(item.progress, item.total)}/{item.total}
            </Text>
          </View>
        </View>
        <View
          className={`rounded-full h-7 w-7 min-w-7 justify-center items-center ${
            isDone ? "bg-success" : "bg-neutral-200 dark:bg-neutral-800"
          }`}
        >
          {isDone && <Check size={20} color='white' strokeWidth={3} />}
        </View>
      </Pressable>
    );
  };

  const ListHeaderComponent = () => (
    <View className='pb-2'>
      <Text className='font-semibold mb-2'>Process</Text>
      <ProgressBar value={percent} />
      <Text className='font-semibold mb-2 mt-5'>Badges</Text>
    </View>
  );

  return (
    <SafeAreaView className='flex-1' style={{ paddingTop: insets.top }}>
      <FlatList
        data={badges}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Dialog
        open={dialogVisible}
        onOpenChange={(open) => {
          setDialogVisible(open);
          if (!open) setSelectedItem(undefined);
        }}
      >
        {selectedItem && (
          <DialogContent className='mx-5 rounded-2xl'>
            <View className='rounded-2xl items-center  gap-5'>
              <Text className='text-2xl font-bold text-primary'>
                {selectedItem.name}
              </Text>

              <Image
                source={selectedItem.icon}
                style={{
                  height: 240,
                  aspectRatio: 86 / 96,
                  opacity:
                    selectedItem.progress >= selectedItem.total ? 1 : 0.3,
                }}
              />
              <Text className='text-center'>{selectedItem.desc}</Text>
              <View className='flex-row gap-2 items-center justify-between w-full'>
                <Progress
                  value={Math.round(
                    (selectedItem.progress / selectedItem.total) * 100
                  )}
                  className='h-3 w-full flex-1 bg-neutral-200 dark:bg-neutral-800'
                  indicatorClassName='bg-success'
                />
                <Text className='font-semibold'>
                  {Math.min(selectedItem.progress, selectedItem.total)}/
                  {selectedItem.total}
                </Text>
              </View>
              <View className='gap-3 w-full'>
                <Button className='w-full flex-row gap-2' onPress={() => {}}>
                  <Text className=' font-semibold'>Share</Text>
                  <Share2 color='white' size={20} />
                </Button>
                <Button
                  variant='neutral'
                  className='w-full'
                  onPress={() => setDialogVisible(false)}
                >
                  <Text>Close</Text>
                </Button>
              </View>
            </View>
          </DialogContent>
        )}
      </Dialog>
    </SafeAreaView>
  );
};

export default Achievements;
