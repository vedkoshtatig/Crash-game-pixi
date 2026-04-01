import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export class BetHistory extends Container {
  private bg!: Graphics;
  private content!: Container;
  private maskGraphics!: Graphics;

  private panelHeight = 0;
  private leftPadding = 24;
  private lastHistory: number[] = [];
  private totalWidth = 0;

  constructor() {
    super();

    this.init();
    this.initEvents();
  }

  private init() {
    // ✅ background
    this.bg = new Graphics();
    this.addChild(this.bg);

    // ✅ content (pills go here)
    this.content = new Container();
    this.addChild(this.content);

    // ✅ mask
    this.maskGraphics = new Graphics();
    this.addChild(this.maskGraphics);

    this.content.mask = this.maskGraphics;
  }

  private initEvents() {
    gameEvents.on("history:update", (history: number[]) => {
      this.lastHistory = history;
      this.renderHistory(history);
    });
  }

  private getColor(value: number) {
    if (value < 2) return 0x072a66;
    else if (value < 5) return 0x143e99;
    else if (value < 7) return 0x0f5c52;
    else if (value < 12) return 0x138d75;
    else if (value < 15) return 0xc67c0a;
    else return 0xccb03a;
  }

  private renderHistory(history: number[]) {
    // ✅ clear only content (NOT whole container)
    this.content.removeChildren();

    let x = this.leftPadding;
    this.totalWidth = 0;

    history.forEach((value) => {
      const txt = new Text({
        text: value.toFixed(2) + "x",
        style: {
          fill: 0xffffff,
          fontSize: 18,
          fontWeight: "600",
        },
      });

      const padX = 16;
      const pillW = txt.width + padX * 2;
      const pillH = txt.height + 6;
      const r = pillH / 2;

      const pill = new Graphics();
      const baseColor = this.getColor(value);

      // base
      pill.roundRect(0, 0, pillW, pillH, r).fill({ color: baseColor });

      // soft shine
      pill.roundRect(0, 0, pillW, pillH, r).fill({
        color: 0xffffff,
        alpha: 0.05,
      });

      // vertical center
      pill.y = this.panelHeight / 2 - pillH / 2;
      txt.y = pill.y + pillH / 2 - txt.height / 2;

      // horizontal position
      pill.x = x;
      txt.x = x + pillW / 2 - txt.width / 2;

      this.content.addChild(pill);
      this.content.addChild(txt);

      x += pillW + 12;
      this.totalWidth = x;
    });

    // ✅ AUTO SLIDE LOGIC
    const viewWidth = this.bg.width;

    if (this.totalWidth > viewWidth) {
      const overflow = this.totalWidth - viewWidth;

      gsap.to(this.content, {
        x: -overflow,
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      gsap.to(this.content, {
        x: 0,
        duration: 0.4,
      });
    }
  }

  private layout(width?: number, height?: number) {
    if (!width || !height) return;

    // ✅ mask (clip area)
    this.maskGraphics.clear()
      .roundRect(0, 0, width, height, 20)
      .fill(0xffffff);

    // ✅ glass background
    this.bg.clear()
      .roundRect(0, 0, width, height, 20)
      .fill({ color: 0xffffff, alpha: 0.06 })
      .stroke({ color: 0xffffff, alpha: 0.12, width: 1 });

    // ✅ shadow
    this.bg.filters = [
      new DropShadowFilter({
        color: 0x000000,
        alpha: 0.25,
        blur: 10,
        offset: { x: 0, y: 4 },
      }) as any,
    ];
  }

  public resize(width: number, height: number) {
    this.panelHeight = height;

    this.layout(width, height);

    if (this.lastHistory.length) {
      this.renderHistory(this.lastHistory);
    }
  }
}