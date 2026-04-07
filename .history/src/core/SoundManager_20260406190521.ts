import { sound } from "@pixi/sound";

export default class SoundManager {
  private static _instance: SoundManager;

  static get instance() {
    if (!this._instance) {
      this._instance = new SoundManager();
    }
    return this._instance;
  }

  loadSounds(baseUrl: string) {
    sound.add("bgm", `${baseUrl}sfx/BGM-Low-DCible.mp3`);
    sound.add("blast", `${baseUrl}sfx/Blast.mp3`);
    sound.add("timer", `${baseUrl}sfx/count.mp3`);
    sound.add("takeOff", `${baseUrl}sfx/Start-TakeOff.mp3`);
    sound.add("fly", `${baseUrl}sfx/inthe air.mp3`);
  }

play(name: string, loop = false, volume = 0.4) {
  sound.play(name, {
    loop,
    volume,
  });
}

  stop(name: string) {
    sound.stop(name);
  }
}