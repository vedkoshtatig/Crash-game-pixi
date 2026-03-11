import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";

export class BetPanel extends Container {

  private bg!: Graphics;
  private card!: HTMLDivElement;

  constructor() {
    super();

    this.init();
    this.createHTMLCard();
    this.layout();

    window.addEventListener("resize", () => this.layout());

    // ⭐ IMPORTANT → sync DOM every frame
    Ticker.shared.add(this.updateDOMPosition, this);
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

 private wrapper!: HTMLDivElement;

private createHTMLCard() {

  const uiLayer = document.getElementById("ui-layer")!;

  this.wrapper = document.createElement("div");
  this.wrapper.className = "bet-panel-wrapper";

  uiLayer.appendChild(this.wrapper);

  // initially add one card
  this.addBetCard();
}
public addBetCard() {

  const card = document.createElement("div");
  card.className = "bet-card-ui";

  card.innerHTML = `
     <div class="bet-mode">
        <button class="active">Bet</button>
        <button>Auto</button>
     </div>

     <div class="bet-row">
        <button class="minus">−</button>
        <div class="amount">1.00</div>
        <button class="plus">+</button>
     </div>

     <button class="place-bet">
        Bet<br>
        <span>1.00 USD</span>
     </button>
  `;

  this.wrapper.appendChild(card);
}
  private updateDOMPosition = () => {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;
    const flyAreaHeight = height / 1.55;

    const y = headerHeight + betHistoryHeight + flyAreaHeight;
    const panelHeight = height - y;
    const panelWidth = width - sidebarWidth;

    const global = this.getGlobalPosition();

    this.card.style.left = global.x + "px";
    this.card.style.top = global.y + "px";
    this.card.style.width = panelWidth + "px";
    this.card.style.height = panelHeight + "px";
  }

  layout() {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;
    const flyAreaHeight = height / 1.55;

    const y = headerHeight + betHistoryHeight + flyAreaHeight;
    const panelHeight = height - y;
    const panelWidth = width - sidebarWidth;

    this.bg.clear()
      .roundRect(0, 0, panelWidth, panelHeight, 20)
      .fill(0x1a1a1a);
  }
}