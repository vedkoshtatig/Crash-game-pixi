import { Container, Graphics } from "pixi.js";

export class BetPanel extends Container {

  private bg: Graphics;

  constructor() {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  resize(width: number, height: number) {

    this.bg.clear()
      .rect(0, 0, width, height)
      .fill(0xffffff);

  }

}