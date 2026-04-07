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

 static play(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

    // slight variation for realism (optional)
    sound.rate(Math.random() * 0.1 + 0.95);

    sound.play();
  }

  static stop(key: SoundKey) {
    this.sounds[key]?.stop();
  }

  static pause(key: SoundKey) {
    this.sounds[key]?.pause();
  }

  static playBGM() {
    this.sounds.bgm.play();
  }

  static stopBGM() {
    this.sounds.bgm.stop();
  }

  static muteAll(mute: boolean) {
    Howler.mute(mute);
  }

  static setVolume(volume: number) {
    Howler.volume(volume);
  }
  static playLoop(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

    sound.loop(true); // enable looping
    sound.play();
  }
  static stopLoop(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

    sound.loop(false); // disable looping
    sound.stop();
  }
}