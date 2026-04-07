import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";
import { GameController } from "./controller/GameController";
import { AssetLoader } from "./core/AssetLoader";
import "@esotericsoftware/spine-pixi-v8";
import "./style.css";

export let app: Application;

(async () => {
  const loadingBar = document.getElementById("loading-bar") as HTMLDivElement;
  const loadingText = document.getElementById("loading-text") as HTMLParagraphElement;
  const loadingScreen = document.getElementById("loading-screen") as HTMLDivElement;
  const playText = document.getElementById("play-text") as HTMLHeadingElement;

  // ✅ Load fonts
  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  // ✅ Load assets
  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingText) loadingText.innerText = percent + "%";
  });

  // ✅ Show "Click Anywhere"
  if (playText) {
    playText.style.display = "block";
  }

  // ✅ Start Game on First Click
  const startGame = async () => {
    console.log("Game started");

    // 🎬 Hide loading screen
    if (loadingScreen) {
      loadingScreen.style.transition = "opacity 0.4s ease";
      loadingScreen.style.opacity = "0";

      setTimeout(() => {
        loadingScreen.remove();
      }, 400);
    }

    // 🚀 Init Pixi
    app = new Application();

    await app.init({
      background: "#000000",
      resizeTo: document.getElementById("pixi-container")!,
      antialias: true,
    });

    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // 🎮 Game setup
    const mainScreen = new MainScreen();
    app.stage.addChild(mainScreen);

    new GameController();
  };

  // 👇 User interaction trigger
  window.addEventListener("pointerdown", startGame, { once: true });
})();