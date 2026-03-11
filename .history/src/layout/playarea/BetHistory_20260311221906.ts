import { Graphics, Container, Text } from "pixi.js";

import { gameEvents } from "../../controller/GameController";
import { app } from "../../main";

export class BetHistory extends Container {
  private bg!: Graphics;
private items: Text[] = [];
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

    const sidebarWidth = width / 3.7;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;

    this.bg
      .clear()
      .rect(0, 0, width - sidebarWidth, betHistoryHeight)
      .fill(0x000000);
  }
}
