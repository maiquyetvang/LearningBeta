import * as React from 'react';

import Svg, { Path, SvgProps } from 'react-native-svg';
export const MessageRectangle = (props: SvgProps) => (
  <Svg width={8} height={8} fill="none" {...props}>
    <Path fill="#EA8934" d="M8 0H0l8 8V0Z" />
  </Svg>
);
