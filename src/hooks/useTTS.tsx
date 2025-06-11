import { useState, useEffect, useCallback } from "react";
import Tts, { Options } from "react-native-tts";
import { SUPPORTED_VOICE_MAP } from "~/configs/default-language";
interface SpeakOptions {
  language?: string;
  rate?: number;
  pitch?: number;
}
import * as Speech from "expo-speech";
const useTTS = (language: string = "en") => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text: string, options?: SpeakOptions) => {
    try {
      if (isSpeaking) {
        await Speech.stop();
      }

      setIsSpeaking(true);

      await Speech.speak(text, {
        language: options?.language || "en",
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 0.9, // Tốc độ mặc định là 0.9
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("TTS error:", error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error("TTS error:", error);
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
