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
    sound.add("bgm", `${baseUrl}sfx/BackGround-BGM.mp3`);
    sound.add("blast", `${baseUrl}sfx/Blast.mp3`);
  }

  play(name: string, loop = false) {
    sound.play(name, { loop });
  }

  stop(name: string) {
    sound.stop(name);
  }
}