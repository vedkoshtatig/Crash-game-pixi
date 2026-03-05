import { Application } from "pixi.js";
import { MainScreen } from "./screens/MainScreen"
import "./style.css";

export let app: Application;

(async () => {

  // Create PIXI app
  app = new Application();

  await app.init({
    background: "0x222222",
    resizeTo: window,
    antialias: true
  });

  // Add canvas to HTML
  document
    .getElementById("pixi-container")!
    .appendChild(app.canvas);

this.app.stage.addChild(MainScreen)
  

})();