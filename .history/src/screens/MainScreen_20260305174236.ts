import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar} from "../layout/SideBar";
export class MainScreen extends Container {
public header!: Header;
public sideBar !: SideBar
  constructor() {
    super();
    this.header = new Header();
    this.sideBar = new SideBar()
    this.init();
    
  }

  private init() {
    this.addChild(this.header)
    
  }
}