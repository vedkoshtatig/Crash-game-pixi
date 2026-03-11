import { Graphics, Container, Text} from "pixi.js";

import { gameEvents } from "../controller/GameController";
import { app } from "../main";

export class SideBar extends Container {

  private bg!: Graphics;
private resultCard!: Graphics;
private resultTitle!: Text;
private resultValue!: Text;

private listContainer!: Container;

private history: number[] = [];
  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
  this.bg = new Graphics();
  this.addChild(this.bg);

  this.resultCard = new Graphics();
  this.addChild(this.resultCard);

  this.resultTitle = new Text({
    text: "Round Result",
    style: {
      fill: "#8b97a6",
      fontSize: 18,
      fontWeight: "bold"
    }
  });

  this.resultValue = new Text({
    text: "1.00x",
    style: {
      fill: "#3fa9ff",
      fontSize: 42,
      fontWeight: "bold"
    }
  });

  this.addChild(this.resultTitle);
  this.addChild(this.resultValue);

  this.listContainer = new Container();
  this.addChild(this.listContainer);

  this.initEvents();
}
initEvents() {
  gameEvents.on("history:update", (history: number[]) => {

    this.history = history;

    if (!history.length) return;

    const last = history[0];

    this.resultValue.text = last.toFixed(2) + "x";

    // ⭐ color logic like casino
    if (last >= 10) this.resultValue.style.fill = "#ff9f43";
    else if (last >= 2) this.resultValue.style.fill = "#00ff88";
    else this.resultValue.style.fill = "#3fa9ff";

    this.renderBetList();
  });
}
renderBetList() {

  this.listContainer.removeChildren();

  const sidebarWidth = this.bg.width;

  let y = 0;

  for (let i = 0; i < 14; i++) {

    const row = new Graphics()
      .roundRect(0, y, sidebarWidth - 20, 52, 14)
      .fill(0x11161d);

    const name = new Text({
      text: "d***" + Math.floor(Math.random() * 9),
      style: { fill: "#c7d0db", fontSize: 18 }
    });

    const bet = new Text({
      text: "100.00",
      style: { fill: "#c7d0db", fontSize: 18 }
    });

    const win = new Text({
      text: "0.00",
      style: { fill: "#8b97a6", fontSize: 18 }
    });

    name.x = 60;
    name.y = y + 16;

    bet.x = sidebarWidth - 170;
    bet.y = y + 16;

    win.x = sidebarWidth - 70;
    win.y = y + 16;

    this.listContainer.addChild(row, name, bet, win);

    y += 60;
  }
}
  layout() {

    const { width, height } = app.screen;

    const headerHeight = height /16;
    const sidebarWidth = width / 3.7;

    this.bg.clear()
     .roundRect(
  0,
  0,
  sidebarWidth,
  height - headerHeight,
  20
)
      .fill(0xff0000);

  }
}