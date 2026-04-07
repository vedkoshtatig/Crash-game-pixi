import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import "@esotericsoftware/spine-pixi-v8";
import "./style.css";
import SoundManager from "./core/SoundManager";

export let app: Application;

(async () => {
  const loadingBar = document.getElementById("loading-bar") as HTMLDivElement;
  const loadingText = document.getElementById("loading-text") as HTMLParagraphElement;
  const loadingScreen = document.getElementById("loading-screen") as HTMLDivElement;

  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  // ✅ DEFINE BASE URL
  const baseUrl = import.meta.env.BASE_URL;

  // ✅ LOAD ASSETS
  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    console.log("Loading:", percent + "%");

    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingText) loadingText.innerText = percent + "%";
  });
const playBtn = document.getElementById("play-btn") as HTMLButtonElement;
  // ✅ LOAD SOUNDS
  SoundManager.instance.loadSounds(baseUrl);

  // ✅ HIDE LOADING SCREEN
  if (loadingScreen) {
    loadingScreen.style.transition = "opacity 0.4s ease";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.remove();
    }, 400);
  }

  // ✅ PIXI INIT
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

  // ✅ OPTIONAL: START BGM ON FIRST CLICK
  window.addEventListener(
    "pointerdown",
    () => {
      SoundManager.instance.play("bgm", true);
    },
    { once: true }
  );
})();