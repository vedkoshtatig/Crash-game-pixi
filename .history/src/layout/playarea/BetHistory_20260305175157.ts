import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
import { SideBar } from "../SideBar";
export class BetHistory extends Container {
 public header !: Header
  constructor() {
    super();
    this.header = new Header()
    this.build();
    
  }