import { Graphics, Container , Sprite} from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {

  private bg!: Sprite;
  private plane !: Sprite
  private isFlying = false;
  private t = 0;           // time
private speedX = 4;
private speedY = -2;

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
    window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    this.isFlying = true;
     this.t = 0;
    app.ticker.add(this.update, this);
  }
});
  }

  init() {
    this.plane = Sprite.from("/plane.png")
    this.bg = Sprite.from("/bg.png");
    this.addChild(this.bg,this.plane);
  }

  layout() {

  const { width, height } = app.screen;

  const sidebarWidth = width / 3.6;
  const flyAreaHeight = height / 1.6;

  this.bg.width = width - sidebarWidth;
  this.bg.height = flyAreaHeight;


  this.plane.width=200;
  this.plane.height=200
  this.plane.y=320
  this.plane.x=150
  this.plane.scale.x=-0.3
this.plane.position.set(150, flyAreaHeight - 220);
}
update() {

  if (!this.isFlying) return;

  const flyWidth = this.bg.width;
  const flyHeight = this.bg.height;

  this.plane.x += this.speedX;
  this.plane.y += this.speedY;

  // stop at right edge
  if (this.plane.x + this.plane.width > flyWidth) {
    this.plane.x = flyWidth - this.plane.width;
  }

  // stop at top edge
  if (this.plane.y < 0) {
    this.plane.y = 0;
  }

}
}