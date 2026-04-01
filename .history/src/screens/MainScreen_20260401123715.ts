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



  // 👉 FLY AREA FULL
  this.flyArea.position.set(0, 0);
  this.flyArea.resize(width, height);

  // 👉 BET HISTORY FLOATING TOP
  this.betHistory.resize(width * 0.6, 50);
  this.betHistory.position.set(
    (width - this.betHistory.width) / 2,
    10
  );

  // 👉 FLOATING BET PANEL (BOTTOM LEFT)
  const panelWidth = width * 0.22;
  const panelHeight = height * 0.35;

  this.betPanel.resize(panelWidth, panelHeight);

  this.betPanel.position.set(
    20,                     // left margin
    height - panelHeight - 20 // bottom spacing
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
