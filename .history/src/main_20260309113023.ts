import { Application, Assets, Text } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import "./style.css";


 await Assets.load(["/bg.png","/plane-idle.png , plane-run , plane-blast"]);

export let app: Application;
(async () => {
  app = new Application();

 await app.init({
  background: "#000000",
  resizeTo: document.getElementById("pixi-container")!,
  antialias: true
});

document
  .getElementById("pixi-container")!
  .appendChild(app.canvas);

  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
})();
