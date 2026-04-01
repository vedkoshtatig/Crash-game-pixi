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
  private resizeRaf = 0;
  constructor() {
    super();
   
    this.init();
    this.layout();

    app.renderer.on("resize", this.onRendererResize, this);
  }

  private onRendererResize() {
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = 0;
      this.layout();
    });
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
  this.flyArea
);

this.flyArea.addChild(this.betHistory);
  }

private layout() {

  const width= app.screen.width;
  const height= app.screen.height;

  const GAP = 4;
  const isMobile = width <= 1650;

  const betHistoryHeight = height / 32;

if (!isMobile) {

  const leftWidth = width / 5.5;
  const rightWidth = width - leftWidth - GAP * 3;

  // 👉 FLY AREA stays SAME (structure preserved)
  this.flyArea.position.set(0, 0);
  this.flyArea.resize(width, height);

  // 👉 BET HISTORY (FLOATING TOP inside flyarea)
  const historyWidth = rightWidth - GAP * 2;
  const historyHeight = 50;

  this.betHistory.resize(historyWidth, historyHeight);

  this.betHistory.position.set(
    leftWidth+GAP*2,
    10
  );

  // 👉 BET PANEL (FLOATING instead of stretched sidebar)
  const panelHeight = height * 0.5; // 👈 instead of full height

  this.betPanel.resize(leftWidth, panelHeight);



// keep width SAME

// ⭐ FLOAT relative to FULL SCREEN (not left column)
this.betPanel.position.set(
  0,   // move INTO fly area
  0
);
} else {

    // ⭐⭐⭐⭐⭐ MOBILE LAYOUT

    // BET HISTORY (TOP FULL WIDTH)
    this.betHistory.position.set(GAP, GAP);
    this.betHistory.resize(
      width - GAP * 2,
      historyHeight
    );

    // FLY AREA (MIDDLE)
    const flyHeight = height * 0.73;

    this.flyArea.position.set(
      0,0
    );

    this.flyArea.resize(
      width - GAP * 2,
      flyHeight
    );

    // BET PANEL (BOTTOM FULL WIDTH)
    const panelHeight =
      height -
      flyHeight -
      GAP * 2;

    this.betPanel.position.set(
      0,
      flyHeight 
    );

    this.betPanel.resize(
      width - GAP * 2,
      panelHeight
    );
  }
}
}
