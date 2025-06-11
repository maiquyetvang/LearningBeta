import * as Speech from 'expo-speech';
import { useCallback, useState } from 'react';
import Tts from 'react-native-tts';
interface SpeakOptions {
  language?: string;
  rate?: number;
  pitch?: number;
}
const useTTS = (language: string = 'en') => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text: string, options?: SpeakOptions) => {
    try {
      if (isSpeaking) {
        await Speech.stop();
      }

      setIsSpeaking(true);

      await Speech.speak(text, {
        language: options?.language || 'en',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 0.9, // Tốc độ mặc định là 0.9
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('TTS error:', error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const stop = useCallback(() => {
    try {
      Tts.stop();
    } catch (error) {
      console.error('TTS stop error', error);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

export default useTTS;
