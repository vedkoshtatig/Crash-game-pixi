import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";
import { SideBar } from "../SideBar";
import { Header} from "../Header";
import { BetHistory } from "./BetHistory";
import { FlyArea } from "./FlyArea";
export class BetPanel extends Container {
 public sideBar !: SideBar
 public header !: Header
 public betHistory !: BetHistory
 public flyArea !: FlyArea

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.header = new Header()
    this.betHistory = new BetHistory()
    this.flyArea = new FlyArea()
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