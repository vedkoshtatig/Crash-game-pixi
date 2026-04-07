import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import { SoundManager } from "./core/SoundManager";
import "@esotericsoftware/spine-pixi-v8";
import "./style.css";

export let app: Application;

(async () => {
  // ✅ GET LOADING ELEMENTS
  const loadingBar = document.getElementById("loading-bar") as HTMLDivElement;
  const loadingText = document.getElementById("loading-text") as HTMLParagraphElement;
  const loadingScreen = document.getElementById("loading-screen") as HTMLDivElement;

  let isLoaded = false;

  // ✅ LOAD FONTS
  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  // ✅ LOAD ASSETS WITH PROGRESS
  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    console.log("Loading:", percent + "%");

    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingText) loadingText.innerText = percent + "%";

    if (percent === 100) {
      isLoaded = true;
    }
  });

  // ✅ LOAD SOUNDS
  await SoundManager.instance.load();

  // ✅ WAIT FOR USER CLICK TO START GAME + AUDIO
  if (loadingScreen) {
    loadingScreen.addEventListener(
      "pointerdown",
      () => {
        if (!isLoaded) return; // 🚫 prevent early click

        // 🔊 Start background music (also unlocks audio)
        SoundManager.instance.playMusic();

        // 🎬 Fade out loading screen
        loadingScreen.style.transition = "opacity 0.4s ease";
        loadingScreen.style.opacity = "0";

        setTimeout(() => {
          loadingScreen.remove();
        }, 400);
      },
      { once: true }
    );
  }

  // ✅ INIT PIXI
  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // ✅ ADD MAIN SCREEN
  const mainScreen = new MainScreen();
  app.stage.addChild(mainScreen);

  // ✅ GAME CONTROLLER
  new GameController();
})();