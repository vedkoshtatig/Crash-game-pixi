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
  constructor() {
    super();
   
    this.init();
    this.layout();
    window.addEventListener("resize",   this.layout);
  }

  private async init() {

    this.header = new Header();
    this.sideBar = new SideBar();
    this.betHistory = new BetHistory();
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();
    console.log(Assets.get("jetSpine"));

// this.flyArea.addChild(this.jet);
    this.addChild(
  this.betPanel,
  this.betHistory,
  this.flyArea
);
  }

private layout() {

  const { width, height } = app.screen;

  const GAP = 4;
  const isMobile = width <= 920;

  const betHistoryHeight = height / 32;

  if (!isMobile) {

    // ⭐⭐⭐ DESKTOP LAYOUT (your current)
    const leftWidth = width / 3.7;
    const rightWidth = width - leftWidth - GAP * 3;

    this.betPanel.position.set(GAP, GAP);
    this.betPanel.resize(leftWidth, height - GAP * 2);

    this.betHistory.position.set(
      leftWidth + GAP * 2,
      GAP
    );

    this.betHistory.resize(
      rightWidth,
      betHistoryHeight
    );

    const flyHeight = height - betHistoryHeight - GAP * 3;

    this.flyArea.position.set(
      leftWidth + GAP * 2,
      betHistoryHeight + GAP * 2
    );

    this.flyArea.resize(
      rightWidth,
      flyHeight
    );

  } else {

    // ⭐⭐⭐⭐⭐ MOBILE LAYOUT

    // BET HISTORY (TOP FULL WIDTH)
    this.betHistory.position.set(GAP, GAP);
    this.betHistory.resize(
      width - GAP * 2,
      betHistoryHeight
    );

    // FLY AREA (MIDDLE)
    const flyHeight = height * 0.52;

    this.flyArea.position.set(
      GAP,
      betHistoryHeight + GAP * 2
    );

    this.flyArea.resize(
      width - GAP * 2,
      flyHeight
    );

    // BET PANEL (BOTTOM FULL WIDTH)
    const panelHeight =
      height -
      betHistoryHeight -
      flyHeight -
      GAP * 4;

    this.betPanel.position.set(
      GAP,
      betHistoryHeight + flyHeight + GAP * 3
    );

    this.betPanel.resize(
      width - GAP * 2,
      panelHeight
    );
  }
}
}