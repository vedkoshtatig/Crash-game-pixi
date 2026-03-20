import { Graphics, Container, Text ,Texture} from "pixi.js";

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

    // window.addEventListener("resize", () => this.layout());
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
        fontSize: 20,
        fontWeight: "bold"
      }
    });

    txt.x = x;
 txt.y = (this.bg.height - txt.height) / 2;

    x += txt.width + 30;

    this.items.push(txt);
    this.addChild(txt);
  });
}
layout(width?: number, height?: number) {

  if (!width || !height) return;

  const PADDING = 6;

  const pillX = PADDING;
  const pillY = PADDING;
  const pillW = width - PADDING * 2;
  const pillH = height - PADDING * 2;
  const radius = pillH / 2;

  this.bg.clear();

  // ⭐ gradient using fill style texture trick
  const g = document.createElement("canvas");
  g.width = pillW;
  g.height = pillH;

  const ctx = g.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, pillW, 0);

  grad.addColorStop(0, "#0f172a");   // left dark blue-black
  grad.addColorStop(1, "#1f2937");   // right soft grey-blue

  ctx.fillStyle = grad;

  // rounded rect draw in canvas
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(pillW - radius, 0);
  ctx.quadraticCurveTo(pillW, 0, pillW, radius);
  ctx.lineTo(pillW, pillH - radius);
  ctx.quadraticCurveTo(pillW, pillH, pillW - radius, pillH);
  ctx.lineTo(radius, pillH);
  ctx.quadraticCurveTo(0, pillH, 0, pillH - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  const texture = Texture.from(g);

  this.bg
    .roundRect(pillX, pillY, pillW, pillH, radius)
    .fill({ texture });
}
}
