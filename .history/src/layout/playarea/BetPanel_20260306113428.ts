import { Graphics, Container } from "pixi.js";
import { app } from "../../main";
import { ManualBet } from "../../ui/ManualBet";
export class BetPanel extends Container {

  private bg!: Graphics;
  public manualBet !: ManualBet
  constructor() {
    super();
 this.manualBet = new ManualBet();
    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg, this.manualBet);
  }

  layout() {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.65;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 14;
    const flyAreaHeight = height / 1.6;

    const y = headerHeight + betHistoryHeight + flyAreaHeight;
    const panelHeight = height - y;
   this.manualBet.layout(width - sidebarWidth, panelHeight);
    this.bg.clear()
      .rect(
  0,
  0,
  width - sidebarWidth,
  panelHeight,
  
)
      .fill(0xffffff);
  }
}