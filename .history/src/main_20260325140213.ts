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

  const loader = new LoadingScreen();
app.stage.addChild(loader);

await AssetLoader.instance.loadAll(p => {
  loader.updateProgress(p);
});

const game = new GameController();

await game.waitForFirstState();

app.stage.removeChild(loader);
app.stage.addChild(new MainScreen());

})();

