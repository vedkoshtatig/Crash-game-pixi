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
    this.plane = Sprite.from
    this.bg = Sprite.from("/bg.png");
    this.addChild(this.bg);
  }

  layout() {

  const { width, height } = app.screen;

  const sidebarWidth = width / 3.6;
  const flyAreaHeight = height / 1.6;

  this.bg.width = width - sidebarWidth;
  this.bg.height = flyAreaHeight;

}
}