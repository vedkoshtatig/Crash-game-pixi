import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {
 public sideBar !: SideBar
 public header !: Header
 public betHistory !: BetHistory

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.header = new Header()
    this.betHistory = new BetHistory()
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