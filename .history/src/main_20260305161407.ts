import { Application, Assets, Text } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";

export let app: Application;
(async () => {
  app = new Application();

  await app.init({ background: "#000000", resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
})();
