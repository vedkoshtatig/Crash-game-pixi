import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";

export let app: Application;

async function init() {
  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: window,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // create main screen
  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
}

init();