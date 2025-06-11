import { Audio } from 'expo-av';

const successAudio = require('assets/sounds/success.mp3');
const errorAudio = require('assets/sounds/error.mp3');
const congratsAudio = require('assets/sounds/success-fanfare-trumpets.mp3');
const failAudio = require('assets/sounds/fail.mp3');

export async function playResultSound(isError?: boolean) {
  try {
    const { sound } = await Audio.Sound.createAsync(isError ? errorAudio : successAudio);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}
export async function playCongratsSound(isFail?: boolean) {
  try {
    const { sound } = await Audio.Sound.createAsync(isFail ? failAudio : congratsAudio);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}
