import React from 'react';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
export const CheckResultButton = ({
  disabled,
  onCheck,
}: {
  disabled?: boolean;
  onCheck?: () => void;
}) => {
  return (
    <Button
      disabled={disabled}
      variant={disabled ? 'outline' : 'default'}
      style={{
        marginTop: 'auto',
      }}
      onPress={onCheck}
      className={cn(!disabled && 'bg-primary-50 dark:bg-primary-900')}
    >
      <Text className={cn('font-semibold', !disabled && 'text-primary')}>Check</Text>
    </Button>
  );
};
