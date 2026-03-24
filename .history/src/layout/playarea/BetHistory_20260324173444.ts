import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
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
private getColor(value: number) {

  if (value <2) {
     return 0x1e90ff;   // 🔵 strong blue
    return 0xffa502;   // 🟠 orange
  }
  else if (value < 5) {
    return 0x5352ed;;   // 🟣 violet
  }
  else if (value < 7) {
    return 0x2ed573;   // 🟢 green
  }
  else if (value < 12) {
    return 0x17c0eb;   // 🔵 sky blue
  }
  else if (value < 15) {
   
  }
  else {
    return 0xffdd59;   // 🟡 yellow
  }

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

const baseColor = this.getColor(value);

    pill.roundRect(0, 0, pillW, pillH, r).fill({ color: baseColor });

pill.roundRect(0, 0, pillW, pillH, r).fill({
  color: 0xffffff,
  alpha: 0.08   // subtle glossy overlay
});

    pill.y = this.panelHeight / 2 - pillH / 2;

    txt.y = pill.y + pillH / 2 - txt.height / 2;

    // ⭐⭐⭐ POSITION ANIMATION MAGIC

  if (isNew) {

  if (i === 0) {
    // ⭐ NEW ENTRY HERO ANIMATION

    pill.x = -pillW - 40;
    pill.alpha = 0;
    pill.scale.set(0.6);

    txt.x = pill.x + pillW / 2 - txt.width / 2;
    txt.alpha = 0;
    txt.scale.set(0.6);

    gsap.to(pill, {
      x,
      alpha: 1,
      scale: 1,
      duration: 0.55,
      ease: "back.out(1.8)"
    });

    gsap.to(txt, {
      x: x + pillW / 2 - txt.width / 2,
      alpha: 1,
      scale: 1,
      duration: 0.55,
      ease: "back.out(1.8)"
    });

  } else {
    // ⭐ EXISTING ITEMS SMOOTH PUSH

    const targetX = x;

    pill.x = x - 30;   // start slightly left
    txt.x = pill.x + pillW / 2 - txt.width / 2;

    gsap.to(pill, {
      x: targetX,
      duration: 0.45,
      ease: "power2.out",
      delay: i * 0.03   // ⭐ stagger magic
    });

    gsap.to(txt, {
      x: targetX + pillW / 2 - txt.width / 2,
      duration: 0.45,
      ease: "power2.out",
      delay: i * 0.03
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
