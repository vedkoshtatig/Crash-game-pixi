import { Container } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar } from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";
import { app } from "../main";

export class MainScreen extends Container {

  public header!: Header;
  public sideBar!: SideBar;
  public betHistory!: BetHistory;
  public flyArea!: FlyArea;
  public betPanel!: BetPanel;

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  private init() {

    
    this.flyArea = new FlyArea();
   

    this.addChild(
   
      this.flyArea,
      
    );
  }

  private layout() {

  const { width, height } = app.screen;

  const GAP = 4;

  const headerHeight = height / 18;
  const sidebarWidth = width / 3.7;
  const betHistoryHeight = height / 18;
  const flyAreaHeight = height / 1.6;

  // HEADER


  // SIDEBAR


  // BET HISTORY


  // FLY AREA
  this.flyArea.width=
  this.flyArea.position.set(
    0,0
  );

  // BET PANEL


}
}