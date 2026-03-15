import { Graphics, Container, Text } from "pixi.js";
import { CrashGameStore } from "../../store/CrashGameStore";
import { gameEvents } from "../../controller/GameController";
import { app } from "../../main";

export class BetHistory extends Container {
  private bg!: Graphics;
private items: Text[] = [];
  constructor() {
    super();

    this.init();
    this.initEvents();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }
initEvents() {
  gameEvents.on("history:update", (history: number[]) => {
    this.renderHistory(history);
  });
}
renderHistory(history: number[]) {

  // remove old
  this.items.forEach(t => this.removeChild(t));
  this.items = [];

  let x = 20;

  history.forEach((value) => {

    const txt = new Text({
      text: value.toFixed(2) + "x",
      style: {
        fill: value >= 2 ? "#00ff88" : "#ff3b3b",
        fontSize: 26,
        fontWeight: "bold"
      }
    });

    txt.x = x;
    txt.y = 8;

    x += txt.width + 30;

    this.items.push(txt);
    this.addChild(txt);
  });
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
