import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
export class SideBar extends Container {
  private app!: Application;
  constructor() {
    super();
    this.build();
  }
  build(){
    const rect = new Graphics()
    .rect(0,0,app.screen.width/3.7 , app.screen.height)
    .fill(0xff000)
  }
}