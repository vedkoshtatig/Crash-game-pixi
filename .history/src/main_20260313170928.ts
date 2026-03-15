

import { Application, Assets } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { ApiClient } from "./services/ApiClient";
import "./style.css";

await Assets.load([
  "/bg.png",
  "/plane-idle.png",
  "/plane-run.png",
  "/plane-blast.png",
  "/Clouds_01.png",
  {
    alias: "jetSpineS",
    src: "/Fighter-jets/Jet_Animation.json",
  },
]);

export let app: Application;
(async () => {
  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });
  const api = new ApiClient("PUT_YOUR_TOKEN_HERE");

  // api.getGameStatus()
  //   .then(res => {
  //     console.log("GAME STATUS →", res)
  //   })
  //   .catch(err => {
  //     console.log("API ERROR →", err)
  //   })
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
  new GameController();
})();
