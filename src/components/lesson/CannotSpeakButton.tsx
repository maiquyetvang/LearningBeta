import React from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
export const CannotSpeakButton = ({
  disabled,
  onPress,
}: {
  disabled?: boolean;
  onPress?: () => void;
}) => {
  return (
    <Button
      disabled={disabled}
      variant={"neutral"}
      style={{
        marginTop: "auto",
      }}
      onPress={onPress}
      className={cn(!disabled && "bg-primary-foreground ")}
    >
      <Text className='font-semibold text-neutral-800 dark:text-neutral-200'>
        I can't speak at the moment
      </Text>
    </Button>
  );
};
