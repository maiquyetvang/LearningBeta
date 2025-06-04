import * as React from "react";
import { Animated } from "react-native";
import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Text } from "../ui/text";

type AnimateButtonProps = ButtonProps & {
  isSelected?: boolean;
  wrapperClassName?: string;
  selectedVariant?: ButtonProps["variant"];
};

const AnimatedButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  AnimateButtonProps
>(
  (
    { isSelected, onPress, wrapperClassName, children, className, ...props },
    ref
  ) => {
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

    const renderChildren =
      typeof children === "string" || typeof children === "number" ? (
        <Text>{children}</Text>
      ) : (
        children
      );

    return (
      <Animated.View style={[buttonStyle]} className={cn(wrapperClassName)}>
        <Button
          ref={ref}
          onPress={handlePress}
          className={cn(className)}
          {...props}
        >
          {renderChildren}
        </Button>
      </Animated.View>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton as AnimatedButton };
export type { AnimateButtonProps as SpeakButtonProps };
