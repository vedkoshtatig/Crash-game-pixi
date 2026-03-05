import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
export class Header extends Container {
  private logo!: Text;
  private app!: Application;
  constructor() {
    super();
    this.build();
  }