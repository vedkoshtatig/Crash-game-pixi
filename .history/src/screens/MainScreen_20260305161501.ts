import { Assets, Container, Sprite } from "pixi.js";
import { app } from "../main";




export class MainScreen extends Container {
  private bgImg?: Sprite;
  
  constructor() {
    super();
    this.init();
  }

  async init() {
    await Assets.loadBundle("main");

    this.bgImg = Sprite.from("betBG.png");
    this.bgImg.width = app.screen.width;
    this.bgImg.height = app.screen.height;

    ;
    };

    this.addChild(
      this.bgImg,
      this.header,
      this.betPanel,
      this.footer,
      this.aside,
    );

    // const wheel = new Wheel();
    // this.addChild(wheel);
  }
}
