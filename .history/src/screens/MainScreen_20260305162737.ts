import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
export class MainScreen extends Container {
public header!: Header;
  constructor() {
    super();
    this.init();
    this.header = new Header();
  }

  private init() {
    this.addChild(this.header)
    
  }
}