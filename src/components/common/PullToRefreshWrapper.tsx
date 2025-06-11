import React from 'react';
import { RefreshControl, ScrollView, ViewProps } from 'react-native';

type PullToRefreshWrapperProps = {
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
  contentContainerStyle?: ViewProps['style'];
};

export default function PullToRefreshWrapper({
  refreshing,
  onRefresh,
  children,
  contentContainerStyle,
}: PullToRefreshWrapperProps) {
  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        refreshing ? (
          <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
