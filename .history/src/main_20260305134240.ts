import { Application } from "pixi.js";
import { Game } from "./core/Game";

async function init() {
  const app = new Application();

  // Pixi v8 initialization
  await app.init({
    resizeTo: window,
    background: "#000000",
    antialias: true
  });

  // Add canvas to DOM
  document.body.appendChild(app.canvas);

  // Initialize game
  Game.init(app);

  // Start game
  Game.start();
}

init();