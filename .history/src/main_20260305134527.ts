import { Application } from "pixi.js";
import { Game } from "./core/Game";

async function init() {

  const app = new Application();

  await app.init({
    resizeTo: window,
    background: "#000000"
  });

  document.body.appendChild(app.canvas);

  Game.init(app);

}

init();