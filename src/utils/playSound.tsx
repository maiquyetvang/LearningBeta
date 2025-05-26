import { Audio } from "expo-av";

const successAudio = require("~/assets/sounds/success.mp3");
const errorAudio = require("~/assets/sounds/error.mp3");

export async function playResultSound(isError?: boolean) {
  try {
    const { sound } = await Audio.Sound.createAsync(
      isError ? errorAudio : successAudio
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {}
}
