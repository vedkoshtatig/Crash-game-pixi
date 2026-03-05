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
    const rect = new Graphics()
    .rect(this.sideBar.width ,this.betHistory.height+this.header.height+this.flyArea.height , app.screen.width-this.sideBar.width, app.screen.height /3.8)
    .fill(0xffffff)
    this.addChild(rect)
  }
  }