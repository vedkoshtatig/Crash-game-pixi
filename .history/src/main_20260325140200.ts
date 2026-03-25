import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import '@esotericsoftware/spine-pixi-v8';

export let app: Application;

(async () => {

  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // ⭐ CREATE LOADING SCREEN
  const loader = new LoadingScreen();
  app.stage.addChild(loader);

  // ⭐ LOAD ASSETS WITH PROGRESS
  await AssetLoader.instance.loadAll((p) => {
    loader.updateProgress(p);
  });

  // ⭐ WAIT FIRST GAME SNAPSHOT (important)
  const game = new GameController();   // ⭐ create first


// wait socket hydration
await game.waitForFirstState();

// start game
app.stage.removeChild(loader);
app.stage.addChild(new MainScreen());

})();

