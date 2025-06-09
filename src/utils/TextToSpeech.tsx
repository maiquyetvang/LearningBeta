import * as Speech from 'expo-speech';
export function ExpoSpeech(text?: string, language: string = 'en') {
  if (!text) return null;
  Speech.speak(text);
}
