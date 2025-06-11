import { View, ViewProps } from 'react-native';

import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  safeArea?: 'top' | 'bottom' | 'both';
} & ViewProps;

export const ScreenView = (props: Props) => {
  const insets = useSafeAreaInsets();
  const { safeArea = 'top', style, ...rest } = props;
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        safeArea === 'top' && { paddingBottom: 0 },
        safeArea === 'bottom' && { paddingTop: 0 },
        style,
      ]}
      {...rest}
    />
  );
};
