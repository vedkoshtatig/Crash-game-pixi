import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";

export class BetHistory extends Container {

  constructor() {
    super();

    this.build();
  }
  build() {

 const width = app.screen.width / 3.7
 const height = app.screen.height / 18

 const rect = new Graphics()
    .rect(
      width,
      height,
      app.screen.width - width,
      app.screen.height / 18
    )
    .fill(0xffff00)

 this.addChild(rect)

}
  }