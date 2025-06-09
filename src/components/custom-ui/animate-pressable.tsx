import * as React from 'react';
import { Animated, Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { Button, ButtonProps } from '../ui/button';

type AnimateButtonProps = ButtonProps & {
  isSelected?: boolean;
  wrapperClassName?: string;
};

const AnimatedPressable = React.forwardRef<React.ElementRef<typeof Button>, AnimateButtonProps>(
  ({ isSelected, onPress, wrapperClassName, children, className, variant, ...props }, ref) => {
    const buttonAnimate = React.useRef(new Animated.Value(0)).current;
    const buttonStyle = {
      transform: [
        {
          scale: buttonAnimate.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [1, 0.975, 1],
          }),
        },
      ],
    };

    const handlePress = (event: any) => {
      Animated.spring(buttonAnimate, {
        useNativeDriver: true,
        toValue: 2,
        friction: 5,
      }).start(() => {
        buttonAnimate.setValue(0);
      });

      if (onPress) {
        onPress(event);
      }
    };

    return (
      <Animated.View style={[buttonStyle]} className={cn(wrapperClassName)}>
        <Pressable ref={ref} onPress={handlePress} className={className} {...props}>
          {children}
        </Pressable>
      </Animated.View>
    );
  },
);

AnimatedPressable.displayName = 'AnimatedPressable';

export { AnimatedPressable as AnimatedPressable };
export type { AnimateButtonProps as SpeakButtonProps };
