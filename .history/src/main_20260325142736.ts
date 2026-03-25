

import { Application, Assets } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import '@esotericsoftware/spine-pixi-v8';
import "./style.css";

await AssetLoader.instance.loadAll((p) => {
    console.log("Loading:", Math.round(p * 100), "%");
  });

export let app: Application;
(async () => {
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
