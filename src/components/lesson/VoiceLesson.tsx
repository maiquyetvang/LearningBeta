import { ArrowRightIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { useVoiceRecognition } from "~/src/hooks/useVoiceRecognition";
import { Mic } from "~/src/lib/icons/Mic";
import { Volume2 } from "~/src/lib/icons/Volume2";
import { useColorScheme } from "~/src/lib/useColorScheme";
import { cn } from "~/src/lib/utils";
import { Lesson } from "~/src/types/lesson.type";
import { SpeakButton } from "../custom-ui/speak-button";
import { CheckResultButton } from "./CheckResultButton";

const VoiceMatch = ({
  value: sampleText,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, selectors, answer, audioLanguage } = sampleText.value;
  const { isDarkColorScheme } = useColorScheme();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { state, startListening, stopListening, destroyRecognition } =
    useVoiceRecognition(audioLanguage);
  const sampleWords =
    question
      ?.replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ") || [];
  const spokenWords =
    !!state?.results && !!state ? state.results[0]?.split(" ") : [];

  const checkAllMatch = () =>
    sampleWords.every((word, index) => {
      const spokenWord = !!spokenWords ? spokenWords[index] : "";
      return (
        !!word &&
        !!spokenWords &&
        spokenWords.some((v) => v.toLowerCase() === word.toLowerCase())
      );
    });

  const checkMatchPercent = () => {
    if (!sampleWords.length) return false;
    const matchCount = sampleWords.filter(
      (word) =>
        !!spokenWords &&
        word &&
        spokenWords.some((v) => v.toLowerCase() === word.toLowerCase())
    ).length;
    return matchCount / sampleWords.length >= 0.6;
  };

  useEffect(() => {
    const isMatchEnough = checkMatchPercent();
    if (isMatchEnough) {
      setIsSuccess(true);
      stopListening();
      setIsSuccess(false);
      onSuccess?.(!isMatchEnough);
    } else {
      setIsSuccess(false);
    }
    const timer = setTimeout(() => {
      if (state.isRecording) {
        stopListening();
        setIsSuccess(false);
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [state.results]);

  const renderWords = sampleWords.map((word, index) => {
    const spokenWord = !!spokenWords ? spokenWords[index] : "";
    // const isMatch =
    //   !!word && !!spokenWord
    //     ? word.toLowerCase() === spokenWord.toLowerCase()
    //     : false;
    const isMatch =
      !!word && !!spokenWords
        ? spokenWords.some((v) => v.toLowerCase() === word.toLowerCase()) // word.toLowerCase() === spokenWord.toLowerCase()
        : false;
    return (
      <Text
        key={index}
        style={{
          fontSize: 18,
          marginRight: 4,
          fontWeight: isMatch ? "bold" : "normal",
        }}
        className={cn(
          "text-foreground",
          isMatch ? "text-green-500" : "text-gray-400"
        )}
      >
        {word}
      </Text>
    );
  });
  const handleClickButton = () => {
    if (state.isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View className='flex-1 gap-8'>
      <Text className='font-light text-center text-sm italic'>
        * You can click the speaker to hear the sample
      </Text>
      <View className='justify-center  gap-3 items-center'>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          {renderWords}
        </View>

        <Text className='text-neutral-500'>{state.results}</Text>
        <SpeakButton
          label={answer}
          className='w-fit '
          showIcon
          language={audioLanguage}
          variant={"neutral"}
          disabled={disabled}
          buttonClassName='justify-center text-xl font-bold'
          hideLabel
          customLabel='Play Sample'
          leftIcon={<Volume2 size={20} className='text-foreground' />}
        />
      </View>
      <View className='flex-col gap-2'>
        <Button
          // disabled={isSuccess}
          className=' flex-row  h-fit gap-2  transition-colors'
          variant={state.isRecording ? "destructive" : "default"}
          // style={{ backgroundColor: borderColor, borderWidth: 3 }}
          onPressIn={handleClickButton}
          disabled={disabled}
        >
          {!state.isRecording && !isSuccess && (
            <Text className=''>Speaks </Text>
          )}
          {state.isRecording && !isSuccess && (
            <Text className='animate-pulse'>Listening ...</Text>
          )}
          {isSuccess && <Text className='text-green-500'>Next</Text>}
          {isSuccess ? (
            <ArrowRightIcon
              className='transition-colors'
              color={isDarkColorScheme ? "black" : "white"}
              size={20}
              strokeWidth={1.75}
            />
          ) : (
            <Mic className='text-white' size={20} strokeWidth={1.75} />
          )}
        </Button>
        {/* <Text>{JSON.stringify({ ...state, audioLanguage }, null, 2)}</Text> */}
      </View>
      <View className='mt-auto gap-2'>
        <Button variant='ghost' className='border-none '>
          <Text>I can't speak right now</Text>
        </Button>
        <CheckResultButton disabled={true} />
      </View>
    </View>
  );
};

export default VoiceMatch;
