import { Container, Graphics } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar} from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";

export class MainScreen extends Container {

  public header: Header
  public sideBar: SideBar
  public playArea: PlayArea

  constructor() {
    super()

    this.header = new Header()
    this.sideBar = new SideBar()
    this.playArea = new PlayArea()

    this.addChild(
      this.header,
      this.sideBar,
      this.playArea
    )
  }
}