import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AlertTriangle, CheckIcon, XIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";

const LessonBottomSheet = ({
  isFalse: isFalse_,
  isSkip,
  isLast,
  ref,
  title,
  description,
  onNextStep,
  onChange,
}: {
  isFalse?: boolean;
  isSkip?: boolean;
  isLast?: boolean;
  ref?: React.RefObject<BottomSheet | null>;
  title?: string;
  description?: string;
  onNextStep?: () => void;
  onChange?: (index: number) => void;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const [isFalse, setIsFalse] = useState<boolean | undefined>(isFalse_);
  useEffect(() => {
    setIsFalse(isFalse_);
  }, [isFalse_]);

  let bgColor = isDarkColorScheme ? "#202f36" : "#D7FFB8";
  let icon = (
    <CheckIcon
      size={30}
      className='text-success'
      stroke={isDarkColorScheme ? "#26732f" : "#22b934"}
      strokeWidth={5}
    />
  );
  let titleText = "Congratulation!";
  let titleClass = "text-success";

  if (isSkip) {
    bgColor = isDarkColorScheme ? "#202f36" : "#fff7cc";
    icon = (
      <AlertTriangle
        size={30}
        className='text-yellow-500'
        stroke={"#eab308"}
        strokeWidth={2.5}
      />
    );
    titleText = "Skipped!";
    titleClass = "text-yellow-500";
  } else if (isFalse) {
    bgColor = isDarkColorScheme ? "#202f36" : "#ffdfe0";
    icon = (
      <XIcon
        size={30}
        className='text-white'
        stroke={"#ff4b4b"}
        strokeWidth={5}
      />
    );
    titleText = "Good luck!";
    titleClass = "text-error";
  }

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      onChange={onChange}
      backgroundStyle={{
        backgroundColor: bgColor,
        borderRadius: 20,
      }}
    >
      <BottomSheetView>
        <View className='px-5 !pt-0 pb-10 '>
          <View className=' flex-col  gap-3  justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='p-1.5 items-center justify-center rounded-full bg-background'>
                {icon}
              </View>
              <View className='flex-col'>
                <Text className={`text-xl font-semibold ${titleClass}`}>
                  {titleText}
                </Text>
                {!!description && !isSkip && (
                  <Text className={`whitespace-normal ${titleClass}`}>
                    {description}
                  </Text>
                )}
                {isSkip && (
                  <Text className='text-yellow-500'>
                    You can skip this step and try again later.
                  </Text>
                )}
              </View>
            </View>
            <Button
              className={`rounded-xl border-r-2 border-l-[0px] border-b-2 active:border-b-[1px] active:border-r-[1px] ${
                isSkip ? "bg-yellow-400" : !isFalse ? "bg-success" : "bg-error"
              }`}
              onPress={onNextStep}
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
