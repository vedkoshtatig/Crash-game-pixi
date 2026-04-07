import { Howl, Howler } from "howler";

type SoundKey =
  | "bgm"
  | "blast"
  | "timer"
  | "takeOff"
  | "fly";

class SoundManager {
  static isUnlocked = false;
  private static sounds: Record<SoundKey, Howl>;

  static init(baseUrl: string) {
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

  static unlock() {
    if (this.isUnlocked) return;

    // Required for mobile browsers
    Howler.ctx?.resume();

    this.isUnlocked = true;
  }

  static play(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

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
    this.sounds.bgm?.play();
  }

  static stopBGM() {
    this.sounds.bgm?.stop();
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

    sound.loop(true);
    sound.play();
  }

  static stopLoop(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

    sound.loop(false);
    sound.stop();
  }
}

export default SoundManager;