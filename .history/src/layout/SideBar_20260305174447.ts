import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
import { Header } from "./Header";
export class SideBar extends Container {
 public header !: Header
  constructor() {
    super();
    this.header = new Header()
    this.build();
    
  }
  build(){
    const rect = new Graphics()
    .rect(0,0,app.screen.width/3.7 , app.screen.height-this.header.height)
    .fill(0xff0000)

    this.addChild(rect)
  }
}