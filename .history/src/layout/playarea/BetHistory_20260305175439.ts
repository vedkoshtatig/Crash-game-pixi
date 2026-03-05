import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
import { SideBar } from "../SideBar";
import { Header} from "../Header";
export class BetHistory extends Container {
 public sideBar !: SideBar
 public header !: Header

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.header = new SideBar()
    this.build();
  }
  build(){
    const rect = new Graphics()
    .rect(this.sideBar.width , )
  }
  }