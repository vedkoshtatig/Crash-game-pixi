

import { Application, Assets } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { ApiClient } from "./services/ApiClient";
import '@esotericsoftware/spine-pixi-v8';
import "./style.css";

await Assets.load([
  "/bg.png",
  "/plane-idle.png",
  "/plane-run.png",
  "/plane-blast.png",
  "/Clouds_01.png",
  {
    alias: "jetSpine",
    src: "/Fighter-jets/Jet_Animation.json",
  },
  {
    alias: "jetSpineAtlas",
    src: "/Fighter-jets/Jet_Animation.atlas",
  },
  {
    alias: "blastSpine",
    src: "/Fighter-jets/Jet_Animation.json",
  },
  {
    alias: "blastSpineAtlas",
    src: "/Blast/Blast.atlas",
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
