import { useRef, useCallback, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

export function useLessonBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleSheetChanges = useCallback((index: number) => {
    setIsSheetOpen(index !== -1);
  }, []);
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.collapse();
    setIsSheetOpen(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsSheetOpen(false);
  }, []);

  // const toggleBottomSheet = useCallback(() => {
  //   if (bottomSheetRef.current?.getCurrentIndex() === 0) {
  //     bottomSheetRef.current?.close();
  //   } else {
  //     bottomSheetRef.current?.expand();
  //   }
  // }, []);
  return {
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    handleSheetChanges,
    isSheetOpen,
  };
}
