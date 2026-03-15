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
  public jet : Spine
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
this.jet = Spine.from({
  skeleton: "jetSpine",
  atlas:"jetSpineAtlas"
});
this.jet.state.setAnimation(0, "Fly", true);

// this.flyArea.addChild(this.jet);
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

  const GAP = 4;

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
// AVAILABLE PLAY AREA SIZE
const flyWidth = width - sidebarWidth - GAP * 3;
const flyHeight = flyAreaHeight;

// resize flyarea
this.flyArea.resize(flyWidth, flyHeight);
}
}