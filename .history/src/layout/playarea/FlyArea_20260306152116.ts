import { Graphics, Container , Sprite} from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {

  private bg!: Sprite;
  private plane !: Sprite

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
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


  this.plane.width=100;
  this.plane.height=100
  this.plane.y=360
  this.plane.scale.x=-10

}
}