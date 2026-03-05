import { Assets, Container, Sprite ,Graphics } from "pixi.js";
import { app } from "../main";




export class MainScreen extends Container {
  private bgImg?: Sprite;
  
  constructor() {
    super();
    this.init();
  }

  async init() {


    // this.bgImg = Sprite.from("betBG.png");
    // this.bgImg.width = app.screen.width;
    // this.bgImg.height = app.screen.height;

    
    

    this.addChild(
      this.bgImg,
      
    );

    // const wheel = new Wheel();
    // this.addChild(wheel);
  }
}
