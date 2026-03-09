import { Graphics, Container, Sprite } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;
 private isFlying = false;
private t = 0;           // time
private startX = 150;
private startY = 320;

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.isFlying = true;
        this.t = 0;
      }
    });
    app.ticker.add(this.update, this);
  }

  init() {
    this.plane = Sprite.from("/plane.png");
    this.bg = Sprite.from("/bg.png");
    this.addChild(this.bg, this.plane);
  }

  layout() {
    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const flyAreaHeight = height / 1.6;

    this.bg.width = width - sidebarWidth;
    this.bg.height = flyAreaHeight;

    this.plane.width = 200;
    this.plane.height = 200;
    this.plane.y = 320;
    this.plane.x = 150;
    this.plane.scale.x = -0.3;
   this.plane.position.set(this.startX, this.startY);
  }
  update() {

  if (!this.isFlying) return;

  this.t += 0.03;

  const flyWidth = this.bg.width;
  const flyHeight = this.bg.height;

  const x = this.startX + this.t * 20;
  const y = this.startY - Math.pow(this.t, 2) * 120;

  this.plane.x = x;
  this.plane.y = y;

  // stop when leaving fly area
  if (x > flyWidth || y < 0) {
    this.isFlying = false;
  }

}
}
