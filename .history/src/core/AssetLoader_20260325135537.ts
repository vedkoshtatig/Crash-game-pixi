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

    const assets = [
      "/bg.png",
      "/plane-idle.png",
      "/plane-run.png",
      "/plane-blast.png",
      "/Clouds_01.png",

      { alias: "jetSpine", src: "/Jet-Animation/Jet-Anime.json" },
      { alias: "jetSpineAtlas", src: "/Jet-Animation/Jet-Anime.atlas" },

      { alias: "blastSpine", src: "/Blast/Blast.json" },
      { alias: "blastSpineAtlas", src: "/Blast/Blast.atlas" },
    ];

    await Assets.load(assets, (progress) => {
      if (onProgress) onProgress(progress);
    });
  }
}