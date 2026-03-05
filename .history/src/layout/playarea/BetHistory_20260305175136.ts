import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
import { SideBar } from "./";
export class SideBar extends Container {
 public header !: Header
  constructor() {
    super();
    this.header = new Header()
    this.build();
    
  }