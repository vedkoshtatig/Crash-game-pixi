import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar} from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";

export class MainScreen extends Container {
public header!: Header;
public sideBar !: SideBar
  constructor() {
    super();
    this.header = new Header();
    this.sideBar = new SideBar()
    this.betHistory = new BetHistory(s)
    this.init();
    
  }

  private init() {
    this.addChild(this.header,this.sideBar)
    
  }
}