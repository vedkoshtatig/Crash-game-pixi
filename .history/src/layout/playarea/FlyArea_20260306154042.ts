import { Graphics, Container, Sprite } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;
  private trail!: Graphics;

  private isFlying = false;
  private t = 0;
  private speed = 0.005;
private isHovering = false;
private hoverTime = 0;
private hoverX = 0;
private hoverY = 0;
  private startX = 100;
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

        this.trail.clear();
        this.trail.moveTo(this.startX, this.startY);
      }
    });

    app.ticker.add(this.update, this);
  }

  init() {
    this.bg = Sprite.from("/bg.png");
    this.plane = Sprite.from("/plane.png");
    this.plane.anchor.set(0.5)

    this.trail = new Graphics();

    this.addChild(this.bg, this.trail, this.plane);
  }

  layout() {
    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const flyAreaHeight = height / 1.6;

    this.bg.width = width - sidebarWidth;
    this.bg.height = flyAreaHeight;

    this.plane.width = 200;
    this.plane.height = 200;
    this.plane.scale.x = -0.3;

    this.plane.position.set(this.startX, this.startY);
  }

 update() {

  if (this.isFlying) {

    this.t += this.speed;

    const flyWidth = this.bg.width;

    const x = this.startX + this.t * 400;
    const y = this.startY - Math.pow(this.t, 2) * 120;

    this.plane.position.set(x, y);

    this.trail
      .lineTo(x, y)
      .stroke({
        width: 4,
        color: 0xff3b3b,
        cap: "round",
        join: "round",
      });

    if (x > flyWidth || y < 0) {
  this.isFlying = false;
  this.isHovering = true;

  this.hoverX = this.plane.x;
  this.hoverY = this.plane.y;
}
  }

  // GLIDE animation
  if (this.isGliding) {

    this.t += 0.05;

    const floatY = Math.sin(this.t) * 2;   // small up-down motion
    const floatX = Math.cos(this.t) * 1;   // tiny forward motion

    this.plane.x += floatX;
    this.plane.y += floatY;

  }

}
}