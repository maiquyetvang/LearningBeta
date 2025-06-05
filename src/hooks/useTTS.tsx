import { useState, useEffect, useCallback } from "react";
import Tts, { Options } from "react-native-tts";
import { SUPPORTED_VOICE_MAP } from "~/configs/default-language";

const useTTS = (language: string = "en") => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initTTS = async () => {
      try {
        await Tts.getInitStatus();
        if (!isMounted) return;
        const langCode =
          SUPPORTED_VOICE_MAP[language as keyof typeof SUPPORTED_VOICE_MAP] ||
          SUPPORTED_VOICE_MAP["en"];
        await Tts.setDefaultLanguage(langCode);
      } catch (e) {}
    };
    initTTS();

    const handleStart = () => setIsSpeaking(true);
    const handleFinish = () => setIsSpeaking(false);
    const handleCancel = () => setIsSpeaking(false);

    Tts.addEventListener("tts-start", handleStart);
    Tts.addEventListener("tts-finish", handleFinish);
    Tts.addEventListener("tts-cancel", handleCancel);

    return () => {
      isMounted = false;
      Tts.removeAllListeners("tts-start");
      Tts.removeAllListeners("tts-finish");
      Tts.removeAllListeners("tts-cancel");
    };
  }, [language]);

  const speak = useCallback((text: string, options?: Options) => {
    try {
      Tts.speak(text, options);
    } catch (error) {
      console.error("TTS Error:", error);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      Tts.stop();
    } catch (error) {
      console.error("TTS stop error", error);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

export default useTTS;
