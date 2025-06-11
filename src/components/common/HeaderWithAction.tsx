import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { ArrowLeft } from '~/lib/icons/ArrowLeft';

type Props = {
  title: string;
  onBack?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionClassName?: string;
  className?: string;
  disableAction?: boolean;
};

export default function HeaderWithAction({
  title,
  onBack,
  onAction,
  actionLabel = 'Save',
  actionClassName = 'text-primary',
  className = '',
  disableAction = false,
}: Props) {
  return (
    <View className={`flex-row items-center justify-between mb-6 ${className}`}>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft size={20} className="text-foreground" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold absolute right-1/2  translate-x-1/2">{title}</Text>
      <TouchableOpacity onPress={onAction} disabled={disableAction}>
        <Text
          disabled={disableAction}
          className={`${actionClassName} font-semibold ${!disableAction ? 'opacity-100' : 'opacity-50'}`}
        >
          {actionLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
