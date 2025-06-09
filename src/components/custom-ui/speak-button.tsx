import * as React from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, View } from 'react-native';
import useTTS from '~/hooks/useTTS';
import { Volume2 } from '~/lib/icons/Volume2';
import { cn } from '~/lib/utils';
import ThemeIcon from '../Icon';
import { Button, ButtonProps } from '../ui/button';
import { Text } from '../ui/text';
import { useColorScheme } from '~/lib/useColorScheme';

type SpeakButtonProps = ButtonProps & {
  label?: string;
  iconSize?: number;
  isSelected?: boolean;
  language?: string;
  showIcon?: boolean;
  buttonClassName?: string;
  hideLabel?: boolean;
  customLabel?: string;
  disabledSpeak?: boolean;
  forceEnableSpeak?: boolean;
  image?: ImageSourcePropType;
  leftIcon?: React.ReactNode;
};

const SpeakButton = React.forwardRef<React.ComponentRef<typeof Button>, SpeakButtonProps>(
  (
    {
      label = '',
      iconSize = 20,
      isSelected,
      onPress,
      className,
      children,
      language = 'en',
      showIcon = false,
      buttonClassName,
      customLabel = 'Start Listening',
      hideLabel = false,
      disabledSpeak = false,
      forceEnableSpeak,
      variant,
      image,
      leftIcon,
      ...props
    },
    ref,
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
      if (label && !isSpeaking && ((!disabledSpeak && language === 'ko') || forceEnableSpeak)) {
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

    if (image) {
      return (
        <Animated.View style={[buttonStyle]} className={cn(className)}>
          <Pressable
            ref={ref}
            onPress={handlePress}
            className={cn(
              'p-0 overflow-hidden flex-col border-[1px]',
              isSelected ? 'border-primary' : 'border-neutral-100 dark:border-neutral-800',
              buttonClassName,
            )}
            {...props}
          >
            <View className="w-full aspect-square">
              <Image source={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>

            <View className="w-full bg-background p-2">
              {label && (
                <Text className="text-foreground text-center font-medium">
                  {!hideLabel ? label : customLabel}
                </Text>
              )}
              {showIcon && (
                <View className="absolute right-2 top-2 bg-white/30 rounded-full p-1">
                  <Volume2 size={16} color="white" />
                </View>
              )}
            </View>
          </Pressable>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[buttonStyle]} className={cn(className)}>
        <Button
          ref={ref}
          onPress={handlePress}
          className={cn('justify-start flex-row items-center gap-2', buttonClassName)}
          variant={variant ?? (isSelected ? 'secondary' : 'outline')}
          {...props}
        >
          {leftIcon}
          {showIcon && !leftIcon && <Volume2 size={20} />}
          {label && <Text>{!hideLabel ? label : customLabel}</Text>}
        </Button>
      </Animated.View>
    );
  },
);

SpeakButton.displayName = 'SpeakButton';

export { SpeakButton };
export type { SpeakButtonProps };
