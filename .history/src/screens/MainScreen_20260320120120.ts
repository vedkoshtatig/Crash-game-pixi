import { Container, Assets } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar } from "../layout/SideBar";
import { BetHistory } from "../layout/playarea/BetHistory";
import { FlyArea } from "../layout/playarea/FlyArea";
import { BetPanel } from "../layout/playarea/BetPanel";
import { app } from "../main";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export class MainScreen extends Container {

  public header!: Header;
  public sideBar!: SideBar;
  public betHistory!: BetHistory;
  public flyArea!: FlyArea;
  public betPanel!: BetPanel;

  public jet!: Spine;
  public spineData: any;

  private isSidebarAdded = true;
  private isBooted = false;

  constructor() {
    super();
    this.boot();
  }

  /* =========================
        SAFE BOOT FLOW
     ========================= */
  private async boot() {

    await this.init();

    this.isBooted = true;

    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  private async init() {

    this.header = new Header();
    this.sideBar = new SideBar();
    this.betHistory = new BetHistory();
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();

    console.log(Assets.get("jetSpine"));

    this.addChild(
      this.header,
      this.sideBar,
      this.betHistory,
      this.flyArea,
      this.betPanel
    );
  }

  /* =========================
          RESPONSIVE LAYOUT
     ========================= */
  private layout() {

    if (!this.isBooted) return;

    const { width, height } = app.screen;

    const GAP = 4;
    const isMobileView = width < 780;

    const betHistoryHeight = height / 18;
    const baseHeaderHeight = height / 18;
    const headerHeight = baseHeaderHeight + betHistoryHeight / 3;

    const flyAreaHeight = height / 1.57;
    const sidebarWidth = width / 3.7;

    const betHistoryY = headerHeight - betHistoryHeight / 2;

    /* =========================
            MOBILE VIEW
       ========================= */
    if (isMobileView) {

      let currentY = 0;

      if (this.isSidebarAdded) {
        this.removeChild(this.sideBar);
        this.isSidebarAdded = false;
      }

      // HEADER
      this.header.position.set(0, currentY);
      currentY += headerHeight;

      // BET HISTORY
      this.betHistory.position.set(0, currentY);
      this.betHistory.width = width;
      currentY += betHistoryHeight / 2.5 + GAP;

      // FLY AREA
      this.flyArea.position.set(0, currentY);
      this.flyArea.resize(width, flyAreaHeight);
      currentY += flyAreaHeight + GAP;

      // BET PANEL
      this.betPanel.position.set(0, currentY);
      this.betPanel.resize(width);
      currentY += height / 5 + GAP;

      return;
    }

    /* =========================
            DESKTOP VIEW
       ========================= */
    if (!this.isSidebarAdded) {
      this.addChild(this.sideBar);
      this.isSidebarAdded = true;
    }

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
      betHistoryY + betHistoryHeight + GAP * 2
    );

    // BET PANEL
    this.betPanel.position.set(
      sidebarWidth + GAP * 2,
      betHistoryY + betHistoryHeight + flyAreaHeight + GAP * 3
    );

    const flyWidth = width - sidebarWidth - GAP * 3;

    this.flyArea.resize(flyWidth, flyAreaHeight);
    this.betPanel.resize(flyWidth);
  }
}