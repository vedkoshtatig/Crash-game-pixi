import { Graphics, Container, Text } from "pixi.js";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export class BetHistory extends Container {
  private maskGraphics!: Graphics;
  private bg!: Graphics;
  private liveTag!: Container;

  private panelHeight = 0;
  private leftPadding = 24;

  private lastHistory: number[] = [];

  private placeholderPill?: Graphics;
  private placeholderText?: Text;

  constructor() {
    super();
    this.init();
    this.initEvents();
  }

  private init() {
    // BG
    this.bg = new Graphics();
    this.addChild(this.bg);

    // MASK
    this.maskGraphics = new Graphics();
    this.addChild(this.maskGraphics);
    this.mask = this.maskGraphics;

    // LIVE TAG
    this.liveTag = new Container();

    const tagBg = new Graphics();
    tagBg.roundRect(0, 0, 120, 32, 16)
      .fill({ color: 0x1e293b, alpha: 0.9 });

    tagBg.stroke({
      color: 0x38bdf8,
      alpha: 0.8,
      width: 1
    });

    const txt = new Text({
      text: "LIVE STATS",
      style: {
        fill: 0xffffff,
        fontSize: 13,
        fontWeight: "600"
      }
    });

    txt.anchor.set(0.5);
    txt.x = 60;
    txt.y = 16;

    this.liveTag.addChild(tagBg, txt);
    this.addChild(this.liveTag);

    // subtle float glow
    gsap.to(this.liveTag, {
      alpha: 0.85,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
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

  // ===============================
  // 🟡 PLACEHOLDER
  // ===============================
  public showPlaceholder() {
    const pillW = 80;
    const pillH = 30;

    const pill = new Graphics();

    pill.roundRect(0, 0, pillW, pillH, pillH / 2)
      .fill({ color: 0x1a1a1a, alpha: 0.8 });

    const txt = new Text({
      text: "...",
      style: {
        fill: 0xffffff,
        fontSize: 16
      }
    });

    pill.y = this.panelHeight / 2 - pillH / 2;
    txt.y = pill.y + pillH / 2 - txt.height / 2;

    const startX = this.bg.width + 20;

    pill.x = startX;
    txt.x = startX + pillW / 2 - txt.width / 2;

    this.addChild(pill, txt);

    this.placeholderPill = pill;
    this.placeholderText = txt;

    // shift existing pills
    this.children.forEach((child) => {
      if (
        child !== this.bg &&
        child !== this.maskGraphics &&
        child !== this.liveTag &&
        child !== pill &&
        child !== txt
      ) {
        gsap.to(child, {
          x: child.x + 90,
          duration: 0.5,
          ease: "power3.out"
        });
      }
    });

    // slide in
    gsap.to(pill, {
      x: this.leftPadding,
      duration: 0.5,
      ease: "power3.out"
    });

    gsap.to(txt, {
      x: this.leftPadding + pillW / 2 - txt.width / 2,
      duration: 0.5,
      ease: "power3.out"
    });
  }

  // ===============================
  // 🟢 REVEAL
  // ===============================
  public revealResult(value: number) {
    if (!this.placeholderPill || !this.placeholderText) return;

    const pill = this.placeholderPill;
    const txt = this.placeholderText;

    txt.text = value.toFixed(2) + "x";
    txt.x = pill.x + pill.width / 2 - txt.width / 2;

    const color = this.getColor(value);

    pill.clear();
    pill.roundRect(0, 0, pill.width, pill.height, pill.height / 2)
      .fill({ color });

    // pop
    gsap.fromTo(pill.scale,
      { x: 0.8, y: 0.8 },
      {
        x: 1.15,
        y: 1.15,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      }
    );

    gsap.fromTo(txt.scale,
      { x: 0.8, y: 0.8 },
      {
        x: 1.1,
        y: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      }
    );

    this.placeholderPill = undefined;
    this.placeholderText = undefined;
  }

  // ===============================
  // 🔵 INITIAL HISTORY
  // ===============================
  private renderHistory(history: number[]) {
    this.removeChildren();

    this.addChild(this.bg);
    this.addChild(this.maskGraphics);
    this.addChild(this.liveTag);

    let x = this.leftPadding;

    history.forEach((value) => {
      const txt = new Text({
        text: value.toFixed(2) + "x",
        style: {
          fill: 0xffffff,
          fontSize: 18,
          fontWeight: "600"
        }
      });

      const pillW = txt.width + 32;
      const pillH = txt.height + 6;

      const pill = new Graphics();
      const color = this.getColor(value);

      pill.roundRect(0, 0, pillW, pillH, pillH / 2)
        .fill({ color });

      pill.roundRect(0, 0, pillW, pillH, pillH / 2)
        .fill({ color: 0xffffff, alpha: 0.05 });

      pill.y = this.panelHeight / 2 - pillH / 2;
      txt.y = pill.y + pillH / 2 - txt.height / 2;

      pill.x = x;
      txt.x = x + pillW / 2 - txt.width / 2;

      this.addChild(pill, txt);

      x += pillW + 12;
    });
  }

  // ===============================
  // 🧱 LAYOUT (FIXED GLASS)
  // ===============================
  private layout(width?: number, height?: number) {
    if (!width || !height) return;

    this.maskGraphics.clear()
      .roundRect(0, 0, width, height, 20)
      .fill(0xffffff);

    this.bg.clear();

    // 🌫️ glass base
    this.bg.roundRect(0, 0, width, height, 20)
      .fill({ color: 0xffffff, alpha: 0.08 });

    // subtle tint
    this.bg.roundRect(0, 0, width, height, 20)
      .fill({ color: 0x60a5fa, alpha: 0.08 });

    // top reflection
    this.bg.roundRect(0, 0, width, height * 0.4, 20)
      .fill({ color: 0xffffff, alpha: 0.12 });

    // border
    this.bg.stroke({
      color: 0xffffff,
      alpha: 0.25,
      width: 1
    });

    // LIVE TAG POSITION
    this.liveTag.x = width / 2 - 60;
    this.liveTag.y = -18;

    // slight transparency
    this.alpha = 0.95;
  }

  public resize(width: number, height: number) {
    this.panelHeight = height;
    this.layout(width, height);

    if (this.lastHistory.length) {
      this.renderHistory(this.lastHistory);
    }
  }
}