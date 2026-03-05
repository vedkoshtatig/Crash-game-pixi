import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../../main";
import { SideBar } from "../SideBar";
import { Header} from "../Header";
import { BetHistory } from "./BetHistory";
export class FlyArea extends Container {
 public sideBar !: SideBar
 public header !: Header

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.header = new Header()
    this.build();
  }
  build(){
    const rect = new Graphics()
    .rect(this.sideBar.width , this.header.height , app.screen.width-this.sideBar.width, app.screen.height /18 )
    .fill(0xffff00)
    this.addChild(rect)
  }
  }