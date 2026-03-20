import { Container , Assets} from "pixi.js";
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
  public jet !: Spine
  public spineData : any;
  private isSidebarAdded = true;
  
  constructor() {
    super();
   
    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  private async init() {

 
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();
    console.log(Assets.get("jetSpine"));

// this.flyArea.addChild(this.jet);
    this.addChild(
  
      this.flyArea,
      this.betPanel,
    );
  }

private layout() {

  const { width, height } = app.screen;
  const GAP = 6;

  const isMobile = width < 780;

  const headerHeight = height / 16;

  /* ================= MOBILE ================= */
  if (isMobile) {

    this.header.position.set(0, 0);

    const flyHeight = height * 0.62;

    this.flyArea.position.set(0, headerHeight + GAP);
    this.flyArea.resize(width, flyHeight);

    this.betPanel.position.set(
      0,
      headerHeight + GAP + flyHeight + GAP
    );

    this.betPanel.resize(width);

    return;
  }

  /* ================= DESKTOP ================= */

  const panelWidth = width * 0.26;     // ⭐ reference UI proportion
  const flyWidth = width - panelWidth - GAP;

  // this.header.position.set(0, 0);

  // ⭐ LEFT BET PANEL (FULL HEIGHT)
  this.betPanel.position.set(0, headerHeight + GAP);
  this.betPanel.resize(panelWidth);

  // ⭐ RIGHT GAME AREA
  this.flyArea.position.set(panelWidth + GAP, headerHeight + GAP);
  this.flyArea.resize(
    flyWidth,
    height - headerHeight - GAP * 2
  );
}}