import { Application, Assets, } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import "./style.css";


export let app: Application;
async  start () => {
  app = new Application();

 await app.init({
  background: "#000000",
  resizeTo: document.getElementById("pixi-container")!,
  antialias: true
});

document
  .getElementById("pixi-container")!
  .appendChild(app.canvas);
await Assets.load("/bg.png");
  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
}
start();
