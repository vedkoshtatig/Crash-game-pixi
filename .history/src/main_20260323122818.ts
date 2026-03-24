

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
    src: "/Jet-Animation/Jet-Anime.json",
  },
  {
    alias: "jetSpineAtlas",
    src: "/Jet-Animation/Jet-Anime.atlas",
  },
  {
    alias: "blastSpine",
    src: "/Blast/Blast.json",
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
function forceResize() {
  const container = document.getElementById("pixi-container")!;
  const rect = container.getBoundingClientRect();

  app.renderer.resize(rect.width, rect.height);
}
window.addEventListener("resize", () => {
  setTimeout(forceResize, 60);   // ⭐ viewport settle delay
});

window.addEventListener("orientationchange", () => {
  setTimeout(forceResize, 120);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    setTimeout(forceResize, 80);
  }
});
setTimeout(forceResize, 100);
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
