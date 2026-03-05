import { Application } from "pixi.js";
import { Game } from "./core/Game";

export let app: Application;

(async () => {

  // Create PIXI app
  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: window,
    antialias: true
  });

  // Add canvas to HTML
  document
    .getElementById("pixi-container")!
    .appendChild(app.canvas);

  // Initialize game
  Game.init(app);

  // Start game
  Game.start();

})();