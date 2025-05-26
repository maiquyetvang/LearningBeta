import * as React from "react";
import { Animated } from "react-native";
import useTTS from "~/src/hooks/useTTS";
import { Volume2 } from "~/src/lib/icons/Volume2";
import { cn } from "~/src/lib/utils";
import ThemeIcon from "../Icon";
import { Button, ButtonProps } from "../ui/button";
import { Text } from "../ui/text";
import { useColorScheme } from "~/src/lib/useColorScheme";
type SpeakButtonProps = ButtonProps & {
  label?: string;
  iconSize?: number;
  isSelected?: boolean;
  language?: string;
  showIcon?: boolean;
  buttonClassName?: string;
  hideLabel?: boolean;
  customLabel?: string;
  leftIcon?: React.ReactNode;
};

const SpeakButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SpeakButtonProps
>(
  (
    {
      label = "",
      iconSize = 20,
      isSelected,
      onPress,
      className,
      children,
      language = "en",
      showIcon = false,
      buttonClassName,
      customLabel = "Start Listening",
      hideLabel = false,
      variant,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const { isDarkColorScheme } = useColorScheme();
    const { speak, isSpeaking } = useTTS(language);
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
      if (label && !isSpeaking) {
        speak(label);
      }
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
      <Animated.View style={[buttonStyle]} className={cn(className)}>
        <Button
          ref={ref}
          onPress={handlePress}
          className={cn(
            "justify-start flex-row items-center gap-2",
            buttonClassName
          )}
          variant={variant ?? (isSelected ? "secondary" : "outline")}
          {...props}
        >
          {leftIcon}
          {showIcon && !leftIcon && <Volume2 size={20} />}
          {label && <Text>{!hideLabel ? label : customLabel}</Text>}
        </Button>
      </Animated.View>
    );
  }
);

SpeakButton.displayName = "SpeakButton";

export { SpeakButton };
export type { SpeakButtonProps };
