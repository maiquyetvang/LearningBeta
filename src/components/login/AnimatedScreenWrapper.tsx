import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { ViewProps, Dimensions } from "react-native";

type Direction = "center" | "up" | "down" | "left" | "right";

type AnimatedScreenWrapperProps = {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
} & ViewProps;

export const AnimatedScreenWrapper: React.FC<AnimatedScreenWrapperProps> = ({
  children,
  direction = "center",
  delay = 150,
  ...rest
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translate = useSharedValue(0);

  const movement = {
    distant: 30,
    duration: 250,
  };

  useEffect(() => {
    if (direction === "center") {
      scale.value = 0.8;
    }
    switch (direction) {
      case "up":
        translate.value = movement.distant;
        break;
      case "down":
        translate.value = -movement.distant;
        break;
      case "left":
        translate.value = movement.distant;
        break;
      case "right":
        translate.value = -movement.distant;
        break;
      default:
        translate.value = 0;
    }

    const timeout = setTimeout(() => {
      if (direction === "center") {
        scale.value = withSpring(1, { damping: 12 });
      }
      opacity.value = withTiming(1, { duration: movement.duration });
      translate.value = withTiming(0, { duration: movement.duration });
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (direction === "center") {
        scale.value = withSpring(0.8, { damping: 12 });
      }
      opacity.value = withTiming(0, { duration: movement.duration });
      switch (direction) {
        case "up":
          translate.value = withTiming(movement.distant, {
            duration: movement.duration,
          });
          break;
        case "down":
          translate.value = withTiming(-movement.distant, {
            duration: movement.duration,
          });
          break;
        case "left":
          translate.value = withTiming(movement.distant, {
            duration: movement.duration,
          });
          break;
        case "right":
          translate.value = withTiming(-movement.distant, {
            duration: movement.duration,
          });
          break;
        default:
          translate.value = withTiming(0, { duration: movement.duration });
      }
    };
  }, [direction, scale, opacity, translate, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const transform = [];
    if (direction === "up" || direction === "down") {
      transform.push({ translateY: translate.value });
    }
    if (direction === "left" || direction === "right") {
      transform.push({ translateX: translate.value });
    }
    if (direction === "center") {
      transform.push({ scale: scale.value });
    }
    return {
      transform,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle} {...rest}>
      {children}
    </Animated.View>
  );
};
