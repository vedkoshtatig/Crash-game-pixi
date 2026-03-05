import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../";
import { SideBar } from "../SideBar";
import { Header} from "../Header";
export class BetHistory extends Container {
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
    .rect(this.sideBar.width , this.header.height , app.screen.width-this.sideBar.width, app.screen.height /10 )
    .fill(0xff0000)
  }
  }