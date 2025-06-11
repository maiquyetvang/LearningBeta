import { ArrowRightIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useVoiceRecognition } from '~/hooks/useVoiceRecognition';
import { Mic } from '~/lib/icons/Mic';
import { Volume2 } from '~/lib/icons/Volume2';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { useLearningStore } from '~/stores/learning.store';
import { Lesson } from '~/types/lesson.type';
import { playResultSound } from '~/utils/playSound';
import { SpeakButton } from '../custom-ui/speak-button';
import { CannotSpeakButton } from './CannotSpeakButton';
import { CheckResultButton } from './CheckResultButton';
const SpeakingLesson = ({
  value: sampleText,
  disabled,
  onSuccess,
  onSkip,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
  onSkip?: () => void;
}) => {
  const { setAudioDisabled } = useLearningStore();
  const { question, answer, questionLanguage } = sampleText.value;
  const { isDarkColorScheme } = useColorScheme();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [textDetected, setTextDetection] = React.useState<string | undefined>();
  const { state, startListening, stopListening, destroyRecognition } =
    useVoiceRecognition(questionLanguage);
  const sampleWords =
    question
      ?.replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ') || [];
  const spokenWords = !!state?.results && !!state ? state.results[0]?.split(' ') : [];

  const normalize = (str: string) => str.replace(/\s/g, '');

  const checkMatchPercent = () => {
    if (!sampleWords.length) return false;
    const normalizedSample = normalize(sampleWords.join(''));
    const normalizedSpoken = normalize(state.results?.[0] ?? '');
    return normalizedSpoken.includes(normalizedSample);
  };

  useEffect(() => {
    if (isSuccess) {
      return;
    }
    setTextDetection(state.results?.[0] || '');
    const isMatchEnough = checkMatchPercent();
    if (isMatchEnough) {
      setIsSuccess(true);
      stopListening();
      // setIsSuccess(false);
      onSuccess?.(!isMatchEnough);
    } else {
      setIsSuccess(false);
    }
    const timer = setTimeout(() => {
      if (state.isRecording) {
        stopListening();
        setIsSuccess(false);
        if (!isMatchEnough) playResultSound(!isMatchEnough);
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [state.results?.[0]]);

  const renderWords = sampleWords.map((word, index) => {
    const spokenWord = spokenWords ? spokenWords[index] : '';
    const isMatch =
      !!word && !!spokenWords
        ? spokenWords.some((v) => v.toLowerCase() === word.toLowerCase())
        : false;
    return (
      <Text
        key={index}
        style={{
          fontSize: 18,
          marginRight: 4,
          fontWeight: isMatch ? 'bold' : 'normal',
        }}
        className={cn(
          'text-foreground',
          isMatch ? 'text-success' : spokenWord ? 'text-error' : 'text-gray-400',
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

  const handleSkip = () => {
    setAudioDisabled(true);
    onSkip?.();
  };

  useEffect(() => {
    if (state.isRecording && state.pitch && state.pitch > 0) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [state.isRecording, state.pitch]);

  return (
    <View className="flex-1 gap-5">
      <Text className="font-light text-center text-sm italic">
        * You can click the speaker to hear the sample
      </Text>
      <View className="justify-center  gap-3 items-center">
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 10,
          }}
        >
          {renderWords}
        </View>

        <Text className="text-neutral-500">{textDetected}</Text>
        <SpeakButton
          label={answer}
          className="w-fit "
          showIcon
          language={questionLanguage}
          variant={"neutral"}
          disabled={disabled || (!isReady && state.isRecording)}
          buttonClassName='justify-center text-xl font-bold'
          hideLabel
          customLabel="Play Sample"
          leftIcon={<Volume2 size={20} className="text-foreground" />}
        />
      </View>

      <View className="flex-col gap-2">
        <Button
          className=" flex-row  h-fit gap-2  transition-colors"
          variant={isReady ? 'destructive' : 'default'}
          onPressIn={handleClickButton}
          disabled={disabled}
        >
          {!isReady && <Text className="">Speaks </Text>}
          {isReady && <Text className="animate-pulse">Listening ...</Text>}

          <Mic className="text-white" size={20} strokeWidth={1.75} />
        </Button>
      </View>
      <View className="mt-auto gap-2">
        <CannotSpeakButton onPress={handleSkip} />
        <CheckResultButton disabled={true} />
      </View>
    </View>
  );
};

export default SpeakingLesson;
