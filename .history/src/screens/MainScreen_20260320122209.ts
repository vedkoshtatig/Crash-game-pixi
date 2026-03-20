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

    window.addEventListener("resize", () => this.layout());
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
      this.header,
      this.sideBar,
      this.betHistory,
      this.flyArea,
      this.betPanel,
    );
  }

private layout() {

  const { width, height } = app.screen;

  const GAP = 4;

  const leftWidth = width / 3.7;          // betpanel width (old sidebar width)
  const betHistoryHeight = height / 18;   // keep SAME
  const rightWidth = width - leftWidth - GAP * 3;

  // ✅ BET PANEL (replaces sidebar → full height)
  this.betPanel.position.set(GAP, GAP);
  this.betPanel.resize(leftWidth, height - GAP * 2);

  // ✅ BET HISTORY (top right)
  this.betHistory.position.set(
    leftWidth + GAP * 2,
    GAP
  );

  this.betHistory.resize(
    rightWidth,
    betHistoryHeight
  );

  // ✅ FLY AREA (fills remaining height)
  const flyHeight = height - betHistoryHeight - GAP * 3;

  this.flyArea.position.set(
    leftWidth + GAP * 2,
    betHistoryHeight + GAP * 2
  );

  this.flyArea.resize(
    rightWidth,
    flyHeight
  );
}
}