import { Assets } from "pixi.js";

export class AssetLoader {

  private static _instance: AssetLoader;

  static get instance() {
    if (!this._instance) {
      this._instance = new AssetLoader();
    }
    return this._instance;
  }

  async loadAll(onProgress?: (p: number) => void) {

    const baseUrl = import.meta.env.BASE_URL;
    const assets = [
      `${baseUrl}bg.png`,
      `${baseUrl}plane-idle.png`,
      `${baseUrl}plane-run.png`,
      `${baseUrl}plane-blast.png`,
      `${baseUrl}Clouds_01.png`,

      { alias: "jetSpine", src: `${baseUrl}Jet-Animation/Jet-Anime.json` },
      { alias: "jetSpineAtlas", src: `${baseUrl}Jet-Animation/Jet-Anime.atlas` },

      { alias: "blastSpine", src: `${baseUrl}Blast/Blast.json` },
      { alias: "blastSpineAtlas", src: `${baseUrl}Blast/Blast.atlas` },
    ];

    await Assets.load(assets, (progress) => {
      if (onProgress) onProgress(progress);
    });
  }
}