import { Graphics, Container } from "pixi.js";
import { app } from "../../main";

export class BetPanel extends Container {

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

    const sidebarWidth = width / 3.6;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;
    const flyAreaHeight = height /1.54;

    const y = headerHeight + betHistoryHeight + flyAreaHeight;
    const panelHeight = height - y;

    this.bg.clear()
      .roundRect(
  0,
  0,
  width - sidebarWidth,
  panelHeight,
  20
)
      .fill(0xffffff);
  }
}