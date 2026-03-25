import { Container, Graphics, Text } from "pixi.js";

export class LoadingScreen extends Container {

  private bar!: Graphics;
  private percentText!: Text;

  constructor() {
    super();

    const bg = new Graphics()
      .rect(0, 0, window.innerWidth, window.innerHeight)
      .fill(0x000000);

    this.addChild(bg);

    this.bar = new Graphics();
    this.addChild(this.bar);

    this.percentText = new Text({
      text: "0%",
      style: {
        fill: 0xffffff,
        fontSize: 32
      }
    });

    this.percentText.anchor.set(0.5);
    this.percentText.x = window.innerWidth / 2;
    this.percentText.y = window.innerHeight / 2 + 40;

    this.addChild(this.percentText);
  }

  updateProgress(p: number) {

    const w = window.innerWidth * 0.5;
    const h = 20;

    this.bar.clear();
    this.bar
      .rect(
        window.innerWidth / 2 - w / 2,
        window.innerHeight / 2,
        w * p,
        h
      )
      .fill(0x2ed573);

    this.percentText.text = Math.round(p * 100) + "%";
  }
}