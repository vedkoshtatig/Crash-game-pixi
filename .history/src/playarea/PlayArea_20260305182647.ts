import { Container } from "pixi.js";
import { BetHistory } from "./BetHistory";
import { FlyArea } from "./FlyArea";
import { BetPanel } from "./BetPanel";

export class PlayArea extends Container {

  public betHistory: BetHistory;
  public flyArea: FlyArea;
  public betPanel: BetPanel;

  constructor() {
    super();

    this.betHistory = new BetHistory();
    this.flyArea = new FlyArea();
    this.betPanel = new BetPanel();

    this.addChild(
      this.betHistory,
      this.flyArea,
      this.betPanel
    );
  }

  resize(width: number, height: number) {

    this.betHistory.position.set(0, 0);

    this.flyArea.position.set(
      0,
      this.betHistory.height
    );

    this.betPanel.position.set(
      0,
      this.betHistory.height + this.flyArea.height
    );

  }

}