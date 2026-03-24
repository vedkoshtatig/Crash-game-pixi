import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";

export class BetHistory extends Container {

  private bg!: Graphics;
  private items: Text[] = [];

  private panelHeight = 0;
private leftPadding = 24;
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

  const isNew =
    this.lastHistory.length &&
    history[0] !== this.lastHistory[0];

  this.removeChildren();
  this.addChild(this.bg);

  this.items = [];

  let x = this.leftPadding;

  history.forEach((value, i) => {

    const txt = new Text({
      text: value.toFixed(2) + "x",
      style: {
        fill: 0xffffff,
        fontSize: 18,
        fontWeight: "600"
      }
    });

    const padX = 16;
    const pillW = txt.width + padX * 2;
    const pillH = txt.height + 6;
    const r = pillH / 2;

    const pill = new Graphics();

    const left = value >= 2 ? 0x00c27a : 0xff4d4d;
    const right = value >= 2 ? 0x00ff88 : 0xff0000;

    pill.roundRect(0, 0, pillW, pillH, r).fill({ color: left });
    pill.roundRect(0, 0, pillW, pillH, r).fill({
      color: right,
      alpha: 0.35
    });

    pill.y = this.panelHeight / 2 - pillH / 2;

    txt.y = pill.y + pillH / 2 - txt.height / 2;

    // ⭐⭐⭐ POSITION ANIMATION MAGIC

    if (isNew) {
      if (i === 0) {
        // NEW ITEM → start from left outside
        pill.x = -pillW;
        txt.x = pill.x + pillW / 2 - txt.width / 2;

        gsap.to(pill, { x, duration: 0.35, ease: "power3.out" });
        gsap.to(txt, {
          x: x + pillW / 2 - txt.width / 2,
          duration: 0.35,
          ease: "power3.out"
        });
      } else {
        // OLD ITEMS → shift right
        const shiftX = x + 60;   // small push feel

        pill.x = shiftX;
        txt.x = shiftX + pillW / 2 - txt.width / 2;

        gsap.to(pill, { x, duration: 0.35, ease: "power3.out" });
        gsap.to(txt, {
          x: x + pillW / 2 - txt.width / 2,
          duration: 0.35,
          ease: "power3.out"
        });
      }
    } else {
      pill.x = x;
      txt.x = x + pillW / 2 - txt.width / 2;
    }

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
    .fill({ color: 0x1A237E, alpha: 0.25 });
}
//////
  public resize(width: number, height: number) {

    this.panelHeight = height;

    this.layout(width, height);

    // ⭐ re-render texts after resize
    if (this.lastHistory.length) {
      this.renderHistory(this.lastHistory);
    }
  }
}
