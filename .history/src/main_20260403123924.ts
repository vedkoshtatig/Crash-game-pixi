import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import '@esotericsoftware/spine-pixi-v8';
import "./style.css";

export let app: Application;

(async () => {
  // ✅ GET LOADING ELEMENTS (ADD THIS AT TOP)
  const loadingBar = document.getElementById("loading-bar") as HTMLDivElement;
  const loadingText = document.getElementById("loading-text") as HTMLParagraphElement;
  const loadingScreen = document.getElementById("loading-screen") as HTMLDivElement;

  // ✅ LOAD FONTS
  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  // ✅ ASSET LOADING WITH UI UPDATE (MODIFY THIS PART)
  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    console.log("Loading:", percent + "%");

    // 🔥 UPDATE LOADING BAR
    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingText) loadingText.innerText = percent + "%";
  });

  // ✅ HIDE LOADING SCREEN (ADD THIS)
  if (loadingScreen) {
    loadingScreen.style.transition = "opacity 0.4s ease";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.remove();
    }, 400);
  }

  // ✅ PIXI INIT (UNCHANGED)
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