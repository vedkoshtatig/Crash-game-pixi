import { Graphics, Container } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {

  private bg!: Graphics;

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
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;
    const flyAreaHeight = height / 1.6;

    this.bg.clear()
     .roundRect(
  0,
  0,
  width - sidebarWidth,
  flyAreaHeight,
  20
)
      .fill(0x0000ff);
  }
}