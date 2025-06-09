import React, { useCallback, useEffect } from 'react';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';
import { SUPPORTED_VOICE_MAP } from '~/configs/default-language';

interface IState {
  recognized?: string;
  pitch?: number;
  error?: string | null;
  end?: string;
  started: string;
  results?: string[] | null;
  partialResults?: string[] | null;
  isRecording?: boolean;
  language?: string;
}
export const useVoiceRecognition = (language: string = 'en') => {
  const [state, setState] = React.useState<IState>({
    recognized: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    isRecording: false,
  });
  const resetState = useCallback(() => {
    setState({
      recognized: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      isRecording: false,
      pitch: 0,
    });
  }, []);
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Voice Recognition Permission',
            message: 'This app needs access to your microphone to recognize speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled differently
  };
  const startListening = useCallback(async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setState((pre) => ({ ...pre, error: 'Microphone permission denied' }));
        return;
      }
      resetState();
      const langCode =
        SUPPORTED_VOICE_MAP[language as keyof typeof SUPPORTED_VOICE_MAP] ||
        SUPPORTED_VOICE_MAP['en'];
      await Voice.start(langCode);
      setState((pre) => ({
        ...pre,
        isRecording: true,
        langCode,
        language,
      }));
    } catch (err) {
      setState((pre) => ({
        ...pre,
        error: err?.toString(),
      }));
    }
  }, [language]);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setState((pre) => {
        return { ...pre, isRecording: false };
      });
      // Stop voice recognition logic here
    } catch (err) {
      setState((pre) => {
        return { ...pre, error: 'Failed to stop listening' };
      });
    }
  }, []);

  const cancelListening = useCallback(async () => {
    try {
      await Voice.cancel();
      resetState();
      // Cancel voice recognition logic here
    } catch (err) {
      setState((pre) => {
        return { ...pre, error: 'Failed to cancel listening' };
      });
    }
  }, []);
  const destroyRecognition = useCallback(async () => {
    try {
      await Voice.destroy();
      resetState();
      // Destroy voice recognition logic here
    } catch (err) {
      setState((pre) => {
        return { ...pre, error: 'Failed to destroy recognition' };
      });
    }
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setState((pre) => {
        return { ...pre, isRecording: true };
      });
    };

    Voice.onSpeechEnd = () => {
      setState((pre) => {
        return { ...pre, isRecording: false };
      });
    };
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      setState((pre) => {
        return { ...pre, results: event.value };
      });
    };
    Voice.onSpeechError = (event: SpeechErrorEvent) => {
      setState((pre) => {
        return { ...pre, error: event?.error?.message };
      });
    };
    Voice.onSpeechRecognized = () => {
      setState((pre) => {
        return { ...pre, isRecording: true };
      });
    };
    // Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
    //   setState((pre) => {
    //     return { ...pre, partialResults: event.value };
    //   });
    // };
    Voice.onSpeechVolumeChanged = (event: SpeechVolumeChangeEvent) => {
      setState((pre) => {
        return { ...pre, pitch: event.value };
      });
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [language]);

  return {
    state,
    setState,
    startListening,
    stopListening,
    cancelListening,
    destroyRecognition,
  };
};
