import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";

export class BetHistory extends Container {
 public sideBar !: SideBar
 public header !: Header

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
      headerHeight,
      app.screen.width - sidebarWidth,
      app.screen.height / 18
    )
    .fill(0xffff00)

 this.addChild(rect)

}
  }