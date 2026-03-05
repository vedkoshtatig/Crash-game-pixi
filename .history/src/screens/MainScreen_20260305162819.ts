import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
export class MainScreen extends Container {
public header!: Header;
  constructor() {
    super();this.header = new Header();
    this.init();
    
  }

  private init() {
    this.addChild(this.header)
    
  }
}