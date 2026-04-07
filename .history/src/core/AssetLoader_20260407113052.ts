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
    { alias: "bg", src: `${baseUrl}bg.png` },
  
    { alias: "cloud", src: `${baseUrl}Clouds_01.png` },

    { alias: "jetSpine", src: `/Jet-Animation/JetAnime.json` },
    { alias: "jetSpineAtlas", src: `/Jet-Animation/JetAnime.atlas` },

    { alias: "blastSpine", src: `${baseUrl}Blast/Blast.json` },
    { alias: "blastSpineAtlas", src: `${baseUrl}Blast/Blast.atlas` },
  ];

  await Assets.load(assets, (progress) => {
    onProgress?.(progress);
  });
}
  }