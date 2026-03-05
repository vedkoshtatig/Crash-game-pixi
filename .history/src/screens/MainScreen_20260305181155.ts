import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar} from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";

export class MainScreen extends Container {
public header!: Header;
public sideBar !: SideBar
public betHistory !: BetHistory
public flyArea !: FlyArea
public BetPanel !: BetPanel
  constructor() {
    super();
    this.header = new Header();
    this.sideBar = new SideBar()
    this.betHistory = new BetHistory()
    this.flyArea = new FlyArea()
    this.BetPanel=new BetPanel()
    this.init();
    
  }

  private init() {
    this.addChild(this.header,this.sideBar,this.betHistory,this.flyArea,this.BetPanel)
    
  }
}