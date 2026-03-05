import { Graphics, Container } from "pixi.js";
import { app } from "../main";

export class SideBar extends Container {

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

    const headerHeight = height / 18;
    const sidebarWidth = width / 3.7;

    this.bg.clear()
      .roundRect(
        0,
        headerHeight,
        sidebarWidth,
        height - headerHeight,
        20
      )
      .fill(0xff0000);

  }
}