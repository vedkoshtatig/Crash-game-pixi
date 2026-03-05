import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {


  constructor() {
    super();
 
    this.build();
  }
  build(){

 const sidebarWidth = app.screen.width / 3.7
 const headerHeight = app.screen.height / 18
 const betHistoryHeight = app.screen.height / 18

 const rect = new Graphics()
   .rect(
      sidebarWidth,
      headerHeight + betHistoryHeight,
      app.screen.width - sidebarWidth,
      app.screen.height / 1.6
   )
   .fill(0x0000ff)

 this.addChild(rect)

}
  }