import React from "react";
import { View } from "react-native";
import { Progress } from "../ui/progress";
import { Text } from "../ui/text";

type ProgressBarProps = {
  value: number;
  label?: string;
};

const ProgressBar = ({ value, label }: ProgressBarProps) => {
  return (
    <View>
      {label && <Text className='font-semibold mb-2'>{label}</Text>}
      <View className='flex-row items-center gap-2'>
        <Progress
          value={value}
          className='h-2 flex-1 bg-neutral-200 dark:bg-neutral-800'
          indicatorClassName='bg-primary'
        />
        <Text className='font-medium'>{Math.round(value)}%</Text>
      </View>
    </View>
  );
};

export default ProgressBar;
