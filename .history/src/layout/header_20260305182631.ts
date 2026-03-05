import { Container, Graphics, Text } from "pixi.js";

export class Header extends Container {

  private bg: Graphics;
  private logo: Text;

  constructor() {
    super();

    this.bg = new Graphics();

    this.logo = new Text({
      text: "AVIATOR",
      style: { fill: "white", fontSize: 24 }
    });

    this.addChild(this.bg, this.logo);
  }

  resize(width: number, height: number) {

    this.bg.clear()
      .rect(0, 0, width, height)
      .fill(0x222222);

    this.logo.position.set(20, height / 2 - this.logo.height / 2);

  }

}