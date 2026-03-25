import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import '@esotericsoftware/spine-pixi-v8';
import "./style.css";

export let app: Application;

(async () => {

  // ⭐ LOAD ASSETS FIRST
  await AssetLoader.instance.loadAll((p) => {
    console.log("Loading:", Math.round(p * 100) + "%");
  });

  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const mainScreen = new MainScreen();
  app.stage.addChild(mainScreen);

  new GameController();

})();

// import { Application, Assets } from "pixi.js";
// import { MainScreen } from "./screens/MainScreen";
// import { GameController } from "./controller/GameController";
// import '@esotericsoftware/spine-pixi-v8';
// import "./style.css";

// await Assets.load([
//   "/bg.png",
//   "/plane-idle.png",
//   "/plane-run.png",
//   "/plane-blast.png",
//   "/Clouds_01.png",
//   {
//     alias: "jetSpine",
//     src: "/Jet-Animation/Jet-Anime.json",
//   },
//   {
//     alias: "jetSpineAtlas",
//     src: "/Jet-Animation/Jet-Anime.atlas",
//   },
//   {
//     alias: "blastSpine",
//     src: "/Blast/Blast.json",
//   },
//   {
//     alias: "blastSpineAtlas",
//     src: "/Blast/Blast.atlas",
//   },
// ]);

// export let app: Application;
// (async () => {
//   app = new Application();

//   await app.init({
//     background: "#000000",
//     resizeTo: document.getElementById("pixi-container")!,
//     antialias: true,
//   });


//   // api.getGameStatus()
//   //   .then(res => {
//   //     console.log("GAME STATUS →", res)
//   //   })
//   //   .catch(err => {
//   //     console.log("API ERROR →", err)
//   //   })
//   document.getElementById("pixi-container")!.appendChild(app.canvas);

//   const mainScreen = new MainScreen();

//   app.stage.addChild(mainScreen);
//   new GameController();
// })();
