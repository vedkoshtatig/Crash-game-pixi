import { Howl, Howler } from "howler";

type SoundKey =
  | "bgm"
  | "blast"
  | "timer"
  | "takeOff"
  | "fly";

export default class SoundManager {
  private static _instance: SoundManager;
  private sounds: Record<SoundKey, Howl> = {} as any;

  static get instance() {
    if (!this._instance) {
      this._instance = new SoundManager();
    }
    return this._instance;
  }

  loadSounds(baseUrl: string) {
    this.sounds = {
      bgm: new Howl({
        src: [`${baseUrl}sfx/BGM-Low-DCible.mp3`],
        loop: true,
        volume: 0.4,
      }),

      blast: new Howl({
        src: [`${baseUrl}sfx/Blast.mp3`],
        volume: 0.4,
      }),

      timer: new Howl({
        src: [`${baseUrl}sfx/count.mp3`],
        volume: 0.4,
      }),

      takeOff: new Howl({
        src: [`${baseUrl}sfx/Start-TakeOff.mp3`],
        volume: 0.4,
      }),

      fly: new Howl({
        src: [`${baseUrl}sfx/inthe air.mp3`],
        loop: true,
        volume: 0.2,
      }),
    };
  }

  play(name: SoundKey, loop?: boolean, volume?: number) {
    const sound = this.sounds[name];
    if (!sound) return;

    if (loop !== undefined) sound.loop(loop);
    if (volume !== undefined) sound.volume(volume);

    sound.play();
  }

  stop(name: SoundKey) {
    this.sounds[name]?.stop();
  }

  stopAll() {
    Howler.stop();
  }

  setGlobalVolume(volume: number) {
    Howler.volume(volume);
  }
}