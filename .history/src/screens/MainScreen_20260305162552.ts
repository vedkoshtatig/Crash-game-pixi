import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
export class MainScreen extends Container {
  constructor() {
    super();
    this.init();
  }

  private init() {
    // create green rectangle
    const rect = new Graphics()
      .rect(0, 0, 200, 200)
      .fill(0x00ff00);

    // center it (optional)
    rect.x = 100;
    rect.y = 100;

    this.addChild(rect);
  }
}