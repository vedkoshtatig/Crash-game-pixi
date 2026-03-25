import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import '@esotericsoftware/spine-pixi-v8';
import "./style.css";

export let app: Application;

(async () => {

  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // ⭐ ADD LOADING SCREEN FIRST
  const loaderScreen = new LoadingScreen();
  app.stage.addChild(loaderScreen);

  // ⭐ LOAD ASSETS
  await AssetLoader.instance.loadAll((p)=>{
    loaderScreen.setProgress(p * 0.7); // assets = 70%
  });

  // ⭐ INIT GAME CONTROLLER + HYDRATION
  const controller = new GameController();

  await controller.waitForInitialSync((p)=>{
    loaderScreen.setProgress(0.7 + p * 0.3); // server sync = 30%
  });

  // ⭐ NOW SHOW REAL GAME
  app.stage.removeChild(loaderScreen);

  const main = new MainScreen();
  app.stage.addChild(main);

})();