import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";

export class BetHistory extends Container {
 public sideBar !: SideBar
 public header !: Header

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.header = new Header()
    this.build();
  }
  build() {

 const sidebarWidth = app.screen.width / 3.7
 const headerHeight = app.screen.height / 18

 const rect = new Graphics()
    .rect(
      sidebarWidth,
      headerHeight,
      app.screen.width - sidebarWidth,
      app.screen.height / 18
    )
    .fill(0xffff00)

 this.addChild(rect)

}
  }