import { Container, Graphics } from "pixi.js";

export class ManualBet extends Container {

  public bg: Graphics;
  this.selectorBg : Graphics;

  constructor() {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  layout(width: number, height: number) {

    this.bg.clear()
      .roundRect(0, 0, width, height, 20)
      .fill(0x222222);

  }
}