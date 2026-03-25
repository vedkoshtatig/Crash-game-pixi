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

