import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";

export class BetPanel extends Container {


  constructor() {
    super();

    this.build();
  }
  build(){

 const sidebarWidth = app.screen.width / 3.7
 const headerHeight = app.screen.height / 18
 const betHistoryHeight = app.screen.height / 18
 const flyAreaHeight = app.screen.height / 1.6

 const rect = new Graphics()
   .rect(
     sidebarWidth,
     headerHeight + betHistoryHeight + flyAreaHeight,
     app.screen.width - sidebarWidth,
     app.screen.height / 3.8
   )
   .fill(0xffffff)

 this.addChild(rect)

}
  }