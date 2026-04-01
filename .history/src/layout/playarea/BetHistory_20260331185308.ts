import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
export class BetHistory extends Container {
private maskGraphics!: Graphics;
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
    this.maskGraphics = new Graphics();
this.addChild(this.maskGraphics);

// ✅ Apply mask to container
this.mask = this.maskGraphics;
  }

  private initEvents() {
    gameEvents.on("history:update", (history: number[]) => {
      this.lastHistory = history;
      this.renderHistory(history);
    });
  }
private getColor(value: number) {

  if (value < 2) {
    return 0x072a66;   // ultra dark blue
  }
  else if (value < 5) {
    return 0x143e99;   // dark royal blue
  }
  else if (value < 7) {
    return 0x0f5c52;   // deep teal green
  }
  else if (value < 12) {
    return 0x138d75;   // darker aqua
  }
  else if (value < 15) {
    return 0xc67c0a;   // dark amber
  }
  else {
    return 0xccb03a;   // muted gold (not too bright)
  }
}
private renderHistory(history: number[]) {

 const isNew =
  this.lastHistory.length &&
  history[0] !== this.lastHistory[0];

  this.removeChildren();

// re-add in correct order
this.addChild(this.bg);
this.addChild(this.maskGraphics);

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
  pill.roundRect(0, 0, pillW, pillH, r)
    .fill({ color: 0xffffff, alpha: 0.05 });

  pill.y = this.panelHeight / 2 - pillH / 2;
  txt.y = pill.y + pillH / 2 - txt.height / 2;

  const targetX = x;

  // ⭐⭐⭐ NEW ENTRY SYSTEM
  if (isNew) {

    if (i === 0) {
      // ✅ NEW PILL ENTER FROM LEFT

      pill.x = -pillW - 20;
      txt.x = pill.x + pillW / 2 - txt.width / 2;

      gsap.to(pill, {
        x: targetX,
        duration: 0.5,
        ease: "power3.out"
      });

      gsap.to(txt, {
        x: targetX + pillW / 2 - txt.width / 2,
        duration: 0.5,
        ease: "power3.out"
      });

    } else {
      // ✅ EXISTING PILLS SHIFT RIGHT

      const prevX = targetX - (pillW + 12);

      pill.x = prevX;
      txt.x = pill.x + pillW / 2 - txt.width / 2;

      gsap.to(pill, {
        x: targetX,
        duration: 0.5,
        ease: "power3.out",
        delay: i * 0.02
      });

      gsap.to(txt, {
        x: targetX + pillW / 2 - txt.width / 2,
        duration: 0.5,
        ease: "power3.out",
        delay: i * 0.02
      });
    }

  } else {
    // initial render
    pill.x = targetX;
    txt.x = targetX + pillW / 2 - txt.width / 2;
  }

  this.addChild(pill);
  this.addChild(txt);

  x += pillW + 12;
});
}

 private layout(width?: number, height?: number) {

  if (!width || !height) return;
this.maskGraphics.clear()
  .roundRect(0, 0, width, height, 20)
  .fill(0xffffff);
 this.bg.clear()
  .roundRect(0, 0, width, height, 20)
  .fill({ color: 0xffffff, alpha: 0.06 }) // glass base
  .stroke({ color: 0xffffff, alpha: 0.12, width: 1 });
  this.bg.filters = [
  new DropShadowFilter({
    color: 0x000000,
    alpha: 0.25,
    blur: 10,
    offset: { x: 0, y: 4 }
  }) as any
];
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
