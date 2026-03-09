import { Container } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar } from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";

export class MainScreen extends Container {

  public header!: Header;
  public sideBar!: SideBar;
  public betHistory!: BetHistory;
  public flyArea!: FlyArea;
  public betPanel!: BetPanel;
  public GAP : number;

  constructor() {
    super();
this.GAP = 12;
    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  private init() {

    this.header = new Header();
    this.sideBar = new SideBar();
    this.betHistory = new BetHistory();
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();

    this.addChild(
      this.header,
      this.sideBar,
      this.betHistory,
      this.flyArea,
      this.betPanel
    );
  }

  private layout() {

    // call layout of all components
    this.header.layout?.();
    this.sideBar.layout?.();
    this.betHistory.layout?.();
    this.flyArea.layout?.();
    this.betPanel.layout?.();

  }
}