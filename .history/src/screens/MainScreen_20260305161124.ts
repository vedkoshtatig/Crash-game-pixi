import { Container, Graphics } from "pixi.js";
import { app } from "../main";

export class MainScreen extends Container {
  constructor() {
    super();
    this.init();
  }

  init() {
    // simple background just for testing
    const bg = new Graphics()
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(0x1e1e1e);



    // example container for future UI
    const gameContainer = new Container();
    this.addChild(gameContainer);
        this.addChild(bg);
  }
}