import React, { useEffect } from "react";
import { Image, Pressable, View } from "react-native";
import { AppImages } from "~/assets";
import { personalizeStepDetail } from "~/src/app/(protected)/(tabs)/(home)/personalize";
import { ChevronLeft } from "~/src/lib/icons/ChevronLeft";
import { ChevronRight } from "~/src/lib/icons/ChevronRight";
import { cn } from "~/src/lib/utils";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { H3 } from "../ui/typography";
import { set } from "react-hook-form";
import { AnimatedScreenWrapper } from "../login/AnimatedScreenWrapper";

type Props = {
  stepIndex: number;
  value?: string;
  onNext: (value: string) => void;
  onPrevious?: () => void;
};

export default function PersonalizeStepScreen({
  stepIndex,
  value,
  onNext,
  onPrevious,
}: Props) {
  const step = personalizeStepDetail[stepIndex];
  const [selectedValue, setSelectedValue] = React.useState<
    string | undefined
  >();
  useEffect(() => {
    setSelectedValue(value);
  }, [value, stepIndex]);
  const handleNext = () => {
    if (!selectedValue) return;
    onNext?.(selectedValue);
  };
  const handlePrevious = () => {
    onPrevious?.();
  };
  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  if (!step) return null;

  if (step.type === "welcome") {
    return (
      <View className='flex-1'>
        <View
          className='flex-1 items-center gap-5 justify-center '
          style={{ marginTop: "auto" }}
        >
          <View className='mx-10 gap-2 bg-neutral-50  dark:bg-neutral-900 rounded-2xl p-3 shadow-sm shadow-neutral-500/50'>
            <H3 className='text-center text-primary'>{step.title}</H3>
            <Text className='text-center'>{step.description}</Text>
          </View>
          <Image
            source={AppImages.kindo_stand}
            style={{ width: 170, height: 240 }}
          />
        </View>
        <Button className='w-full' onPress={() => onNext("")}>
          <Text>{step.button}</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className='flex-1 gap-3'>
      {step.options?.map((option, idx) => {
        const isSelected = selectedValue === option.label;
        return (
          <AnimatedScreenWrapper delay={idx * 75} key={`${stepIndex}-${idx}`}>
            <Pressable
              className={`flex-row rounded-lg border items-center gap-3 p-3 ${
                isSelected
                  ? " border-primary bg-orange-50 dark:bg-primary/50"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
              }`}
              onPress={() => handleSelect(option.label)}
            >
              <View className='rounded-full border border-neutral-200 h-[20px] w-[20px] justify-center items-center'>
                {isSelected && (
                  <View className='h-4 w-4 self-center bg-primary rounded-full' />
                )}
              </View>
              <View className='mr-auto  gap-1'>
                <Text
                  className={`text-base  font-medium ${"description" in option && option.description ? "!text-primary" : ""}`}
                >
                  {option.label}
                </Text>
                {"description" in option && option.description && (
                  <Text className='text-sm font-light'>
                    {option.description}
                  </Text>
                )}
              </View>
              {"subDescription" in option && option.subDescription && (
                <Text className='font-light'>{option.subDescription}</Text>
              )}
              {"recommend" in option && option.recommend && (
                <Text className='text-xs bg-neutral-800 p-1  text-background absolute top-1 right-1  rounded-[4px] ml-2'>
                  👍 Recommend
                </Text>
              )}
              {stepIndex === 1 && (
                <View className='flex-row w-fit gap-0.5 '>
                  {Array.from({ length: 3 }).map((_, i) => {
                    return (
                      <View
                        key={i}
                        className={cn(
                          "h-5 w-5  rounded-sm  ",
                          i === 2 && "rounded-r-2xl",
                          i === 0 && "rounded-l-2xl",
                          i <= idx
                            ? "!bg-primary"
                            : "bg-neutral-200 dark:bg-neutral-800"
                        )}
                      />
                    );
                  })}
                </View>
              )}
            </Pressable>
          </AnimatedScreenWrapper>
        );
      })}

      <View className='mt-auto gap-2'>
        <Text>{value}</Text>
        {stepIndex > 1 && (
          <Button
            className='flex-row gap-2'
            variant='ghost'
            onPress={handlePrevious}
          >
            <ChevronLeft size={20} className='text-foreground' />
            <Text>{step?.button || "Previous Question"}</Text>
          </Button>
        )}
        <Button
          className='flex-row gap-2'
          disabled={!selectedValue}
          onPress={handleNext}
        >
          <Text>{step?.button || "Next"}</Text>
          <ChevronRight color={"white"} size={20} />
        </Button>
      </View>
    </View>
  );
}
