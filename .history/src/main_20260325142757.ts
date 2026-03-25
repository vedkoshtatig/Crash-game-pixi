import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import { LoadingScreen } from "./screens/LoadingScreen";
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
  const loader = new LoadingScreen()
app.stage.addChild(loader)

await AssetLoader.instance.loadAll(p=>{
  loader.setProgress(p * 0.5)
})

const controller = new GameController()



const main = new MainScreen()
app.stage.addChild(main)
})();