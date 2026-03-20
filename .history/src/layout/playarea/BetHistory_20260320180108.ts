import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";

export class BetHistory extends Container {

  private bg!: Graphics;
  private items: Text[] = [];

  private panelWidth = 0;
  private panelHeight = 0;

  private lastHistory: number[] = [];

  constructor() {
    super();

    this.init();
    this.initEvents();
  }

  private init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private initEvents() {
    gameEvents.on("history:update", (history: number[]) => {
      this.lastHistory = history;
      this.renderHistory(history);
    });
  }

private renderHistory(history: number[]) {

  // remove old
  this.items.forEach(t => this.removeChild(t));
  this.items = [];

  // also remove old pill graphics
  this.removeChildren();
  this.addChild(this.bg);

  let x = 12;

  history.forEach((value) => {

    const txt = new Text({
      text: value.toFixed(2) + "x",
      style: {
        fill: "#ffffff",
        fontSize: 18,
        fontWeight: "bold"
      }
    });

    const padX = 14;
    const padY = 6;
   
    const pillW = txt.width ;
    const pillH = txt.height ;
    const r = pillH / 2;

    const pill = new Graphics();

    // ⭐ gradient color selection
    const left = value >= 2 ? 0x00c27a : 0xff4d4d;
    const right = value >= 2 ? 0x00ff88 : 0xff0000;

    pill.roundRect(0, 0, pillW, pillH, r)
        .fill({
          color: left
        });

    // ⭐ fake gradient overlay (pixi v8 trick)
    pill.roundRect(0, 0, pillW, pillH, r)
        .fill({
          color: right,
          alpha: 0.35
        });

    pill.x = x;
    pill.y = this.panelHeight / 2 - pillH / 2;
    pill.pivot.set(pillW/2,pillH/2)
    txt.x = pill.x + padX;
    txt.y = pill.y + padY;

    this.addChild(pill);
    this.addChild(txt);

    this.items.push(txt);

    x += pillW + 12;
  });
}

 private layout(width?: number, height?: number) {

  if (!width || !height) return;

  this.bg.clear()
    .rect(0, 0, width, height)
    .fill({ color: 0x000000, alpha: 0.25 });
}

  public resize(width: number, height: number) {

    this.panelWidth = width;
    this.panelHeight = height;

    this.layout(width, height);

    // ⭐ re-render texts after resize
    if (this.lastHistory.length) {
      this.renderHistory(this.lastHistory);
    }
  }
}