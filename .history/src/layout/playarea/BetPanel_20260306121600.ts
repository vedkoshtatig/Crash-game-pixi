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

 const panelWidth = width - sidebarWidth;

this.bg.clear()
  .rect(0, 0, panelWidth, panelHeight)
  .fill(0xffffff);

// give padding inside panel
const padding = 10;

this.manualBet.position.set(padding, padding);

this.manualBet.layout(
  panelWidth - padding * 2,
  panelHeight - padding * 2
);
}