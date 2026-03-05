import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";
import { SideBar } from "../SideBar";
import { Header} from "../Header";
import { BetHistory } from "./BetHistory";
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
    const rect = new Graphics()
    .rect(this.sideBar.width ,this.betHistory.height+this.header.height , app.screen.width-this.sideBar.width, app.screen.height /1.8)
    .fill(0x0000ff)
    this.addChild(rect)
  }
  }