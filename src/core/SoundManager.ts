import { sound } from "@pixi/sound";

export class SoundManager {
  private static _instance: SoundManager;

  private isMuted = false;

  private constructor() {}

  static get instance() {
    if (!this._instance) {
      this._instance = new SoundManager();
    }
    return this._instance;
  }

  // ✅ LOAD ALL SOUNDS
  async load() {
      const baseUrl = import.meta.env.BASE_URL;
    const sounds = [
      { alias: "bgMusic", src:`${baseUrl}/sfx/BGM-Low-DCible.mp3`},
     
      { alias: "crash", src:`${baseUrl}/sfx/Blast.mp3` },
      { alias: "timer", src:`${baseUrl}/sfx/count.mp3` },
    ];

    for (const s of sounds) {
      sound.add(s.alias, s.src);
    }
  }

  // ✅ PLAY SOUND
 play(
  name: string,
  options: {
    loop?: boolean;
    volume?: number;
    speed?: number;
  } = {}
) {
  if (this.isMuted) return;

  const {
    loop = false,     // ✅ default loop OFF
    volume = 0.5,     // ✅ default volume
    speed = 1,
  } = options;

  sound.play(name, {
    loop,
    volume,
    speed,
  });
}

  // ✅ STOP SOUND
  stop(name: string) {
    sound.stop(name);
  }

  // ✅ BACKGROUND MUSIC
playMusic() {
  if (this.isMuted) return;

  this.play("bgMusic", {
    loop: true,
    volume: 0.3,
  });
}

  stopMusic() {
    sound.stop("bgMusic");
  }

  // ✅ MUTE / UNMUTE
  mute() {
    this.isMuted = true;
    sound.stopAll();
  }

  unmute() {
    this.isMuted = false;
  }

  toggle() {
    this.isMuted ? this.unmute() : this.mute();
  }
}