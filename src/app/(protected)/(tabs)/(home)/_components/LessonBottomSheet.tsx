import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CheckIcon, Flag, FlagIcon, XIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { useColorScheme } from "~/src/lib/useColorScheme";

const LessonBottomSheet = ({
  isFalse: isFalse_,
  isLast,
  ref,
  title,
  description,
  onNextStep,
  onChange,
}: {
  isFalse?: boolean;
  isLast?: boolean;
  ref?: React.RefObject<BottomSheet | null>;
  title?: string;
  description?: string;
  onNextStep?: () => void;
  onChange?: (index: number) => void;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const [isFalse, setIsFalse] = useState<boolean | undefined>(isFalse_);
  const handleNextStep = () => {
    onNextStep?.();
  };
  useEffect(() => {
    setIsFalse(isFalse_);
  }, [isFalse_]);

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      onChange={onChange}
      backgroundStyle={{
        backgroundColor: !isFalse
          ? isDarkColorScheme
            ? "#202f36"
            : "#D7FFB8"
          : isDarkColorScheme
            ? "#202f36"
            : "#ffdfe0",
        borderRadius: 20,
      }}
    >
      <BottomSheetView>
        <View className='px-5 !pt-0 pb-10 '>
          <View className=' flex-col  gap-3  justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='p-1.5 items-center justify-center rounded-full bg-background'>
                {!isFalse ? (
                  <CheckIcon
                    size={30}
                    className='text-success'
                    stroke={isDarkColorScheme ? "#26732f" : "#22b934"}
                    strokeWidth={5}
                  />
                ) : (
                  <XIcon
                    size={30}
                    className='text-white'
                    stroke={"#ff4b4b"}
                    strokeWidth={5}
                  />
                )}
              </View>
              <View className='flex-col'>
                <Text
                  className={`text-xl font-semibold ${
                    !isFalse ? "text-success" : "text-error"
                  }`}
                >
                  {!isFalse ? "Congratulation!" : "Good luck!"}
                </Text>
                {!!description && (
                  <Text
                    className={`whitespace-normal ${!isFalse ? "text-success" : "text-error"}`}
                  >
                    {description}
                  </Text>
                )}
              </View>
            </View>
            <Button
              className={`rounded-xl border-r-2 border-l-[0px] border-b-2 active:border-b-[1px] active:border-r-[1px] ${!isFalse ? "bg-success" : "bg-error"}`}
              onPress={handleNextStep}
            >
              <Text className='text-background px-2 font-bold text-xl'>
                {isLast ? "Finish" : "Next"}
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
LessonBottomSheet.displayName = "LessonBottomSheet";

export default LessonBottomSheet;
