import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";

export class SideBar extends Container {
 public header !: Header
  constructor() {
    super();

    this.build();
    
  }
build(){

 const headerHeight = app.screen.height / 18

 const rect = new Graphics()
   .rect(
     0,
     headerHeight,
     app.screen.width / 3.7,
     app.screen.height - headerHeight
   )
   .fill(0xff0000)

 this.addChild(rect)

}
}