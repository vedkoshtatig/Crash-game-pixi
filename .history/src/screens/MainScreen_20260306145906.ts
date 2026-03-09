import { Container } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar } from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";
import {app}

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

    this.header = new Header();
    this.sideBar = new SideBar();
    this.betHistory = new BetHistory();
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();
const GAP = 12;
    this.addChild(
      this.header,
      this.sideBar,
      this.betHistory,
      this.flyArea,
      this.betPanel
    );
  }

  private layout() {

  const { width, height } = app.screen;

  const GAP = 12;

  const headerHeight = height / 18;
  const sidebarWidth = width / 3.7;
  const betHistoryHeight = height / 18;
  const flyAreaHeight = height / 1.6;

  // HEADER
  this.header.position.set(0, 0);

  // SIDEBAR
  this.sideBar.position.set(
    GAP,
    headerHeight + GAP
  );

  // BET HISTORY
  this.betHistory.position.set(
    sidebarWidth + GAP * 2,
    headerHeight + GAP
  );

  // FLY AREA
  this.flyArea.position.set(
    sidebarWidth + GAP * 2,
    headerHeight + betHistoryHeight + GAP * 2
  );

  // BET PANEL
  this.betPanel.position.set(
    sidebarWidth + GAP * 2,
    headerHeight + betHistoryHeight + flyAreaHeight + GAP * 3
  );

}
}