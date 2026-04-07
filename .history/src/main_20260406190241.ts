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
  const playText = document.getElementById("play-text") as HTMLHeadingElement;

  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  const baseUrl = import.meta.env.BASE_URL;

  // ✅ LOAD ASSETS
  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingText) loadingText.innerText = percent + "%";
  });

  // ✅ PRELOAD SOUNDS (DO NOT PLAY YET)
  SoundManager.init(baseUrl);

  // ✅ SHOW "CLICK ANYWHERE"
  if (playText) {
    playText.style.display = "block";
  }

  // ✅ START GAME (FIRST USER INTERACTION)
  const startGame = async () => {
    console.log("Game started");

    // 🎵 THIS unlocks audio automatically
    SoundManager.play("bgm");

    // 🎬 HIDE LOADING SCREEN
    if (loadingScreen) {
      loadingScreen.style.transition = "opacity 0.4s ease";
      loadingScreen.style.opacity = "0";

      setTimeout(() => {
        loadingScreen.remove();
      }, 400);
    }

    // 🚀 INIT PIXI
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
  };

  // 👇 BEST EVENT FOR GAMES
  window.addEventListener("pointerdown", startGame, { once: true });
})();