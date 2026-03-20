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

    // remove old texts
    this.items.forEach(t => this.removeChild(t));
    this.items = [];

    let x = 20;

    history.forEach((value) => {

      const txt = new Text({
        text: value.toFixed(2) + "x",
        style: {
          fill: value >= 2 ? "#00ff88" : "#ff3b3b",
          fontSize: 20,
          fontWeight: "bold"
        }
      });

      // ⭐ proper vertical centering using stored height
      txt.y = this.panelHeight / 2 - txt.height / 2;
      txt.x = x;

      x += txt.width + 30;

      this.items.push(txt);
      this.addChild(txt);
    });
  }

  private layout(width?: number, height?: number) {

    if (!width || !height) return;

    const pad = 6;
    const w = width - pad * 2;
    const h = height - pad * 2;
    const r = h / 2;

    this.bg.clear()
      .roundRect(pad, pad, w, h, r)
      .fill(0x0f172a);   // dark casino pill color
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