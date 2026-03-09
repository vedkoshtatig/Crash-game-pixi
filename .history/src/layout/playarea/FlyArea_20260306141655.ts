import { Graphics, Container } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {

  private bg!: Graphics;

  private flyAreaWidth = 0;
  private flyAreaHeight = 0;

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  layout() {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.65;
    const flyAreaHeight = height / 1.6;

    this.flyAreaWidth = width - sidebarWidth;
    this.flyAreaHeight = flyAreaHeight;

    this.bg
      .clear()
      .roundRect(
        0,
        0,
        this.flyAreaWidth,
        this.flyAreaHeight,
        20
      )
      .fill(0x0000ff);

  }

}