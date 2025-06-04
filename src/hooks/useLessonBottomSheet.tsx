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

  return {
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    handleSheetChanges,
    isSheetOpen,
  };
}
