import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
import { SideBar } from "../SideBar";
import { SideBar } from "../SideBar";
export class BetHistory extends Container {
 public sideBar !: SideBar

  constructor() {
    super();
    this.sideBar = new SideBar()
    this.build();
  }
  build(){
    const rect = new Graphics()
    .rect(this.sideBar.width , )
  }
  }