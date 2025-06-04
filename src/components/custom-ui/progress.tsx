import React, { useRef, useEffect, useMemo } from "react";
import { View, Animated } from "react-native";
import { cn } from "~/lib/utils";

export interface ProgressStep {
  index: number;
  isFalse?: boolean;
  duration?: number;
}
interface StepProgressBarProps {
  currentIndex?: number;
  progressStep?: ProgressStep[];
  length?: number;
}

export default function StepProgressBar({
  currentIndex,
  progressStep,
  length,
}: StepProgressBarProps) {
  const stepCount = Math.max(progressStep?.length || 0, length || 0, 0);

  const animScales = useMemo(
    () => Array.from({ length: stepCount }, () => new Animated.Value(1)),
    [stepCount]
  );

  const prevIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (
      typeof currentIndex === "number" &&
      currentIndex >= 0 &&
      currentIndex < animScales.length &&
      progressStep &&
      progressStep[currentIndex]
    ) {
      Animated.sequence([
        Animated.timing(animScales[currentIndex], {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [progressStep, currentIndex, animScales, stepCount]);

  // Hiệu ứng khi chuyển sang step mới (màu đen)
  useEffect(() => {
    if (
      prevIndexRef.current !== currentIndex &&
      typeof currentIndex === "number" &&
      currentIndex >= 0 &&
      currentIndex < animScales.length &&
      animScales[currentIndex]
    ) {
      Animated.sequence([
        Animated.timing(animScales[currentIndex], {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animScales[currentIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, animScales, stepCount]);

  return (
    <View
      className={cn(
        "flex-row flex-1 justify-between",
        length && length > 5 ? "gap-1" : "gap-2"
      )}
    >
      {Array.from({ length: stepCount }).map((_, i) => {
        let stepColor = "bg-neutral-100 dark:bg-neutral-800";
        let borderClass = "";

        // Bước hiện tại đã có kết quả
        if (i === currentIndex && progressStep && progressStep[i]) {
          // Nếu là current và isFalse thì tô màu đen
          if (progressStep[i].isFalse) {
            stepColor = "bg-black dark:bg-white";
            borderClass = "border-[1.5px] border-foreground";
          } else {
            stepColor = "bg-green-500";
          }
          return (
            <Animated.View
              key={i}
              style={{
                transform: [{ scale: animScales[i] }],
              }}
              className={`h-2 rounded-sm flex-1 ${stepColor} ${borderClass}`}
            />
          );
        }
        // Bước hiện tại chưa có kết quả (màu đen)
        else if (i === currentIndex) {
          stepColor = "bg-black dark:bg-white";
          return (
            <Animated.View
              key={i}
              style={{
                transform: [{ scale: animScales[i] }],
              }}
              className={`h-2 rounded-sm flex-1 ${stepColor}`}
            />
          );
        }
        // Các bước trước đã hoàn thành (đỏ/xanh)
        else if (
          typeof currentIndex === "number" &&
          i < currentIndex &&
          progressStep &&
          progressStep[i]?.isFalse
        ) {
          stepColor = "bg-red-500";
        } else if (
          typeof currentIndex === "number" &&
          i < currentIndex &&
          progressStep &&
          progressStep[i] &&
          !progressStep[i].isFalse
        ) {
          stepColor = "bg-green-500";
        }
        // Các bước sau currentIndex đã có kết quả (đỏ/xanh)
        else if (
          typeof currentIndex === "number" &&
          i > currentIndex &&
          progressStep &&
          progressStep[i]
        ) {
          stepColor = progressStep[i].isFalse ? "bg-red-500" : "bg-green-500";
        }

        const isJustCompleted =
          typeof currentIndex === "number" &&
          i === currentIndex - 1 &&
          progressStep &&
          progressStep[i] &&
          !progressStep[i].isFalse;

        if (isJustCompleted) {
          return (
            <Animated.View
              key={i}
              style={{
                transform: [{ scale: animScales[i] }],
              }}
              className={`h-2 rounded-sm flex-1 ${stepColor}`}
            />
          );
        }

        return (
          <View key={i} className={`h-2 rounded-sm flex-1 ${stepColor}`} />
        );
      })}
    </View>
  );
}
