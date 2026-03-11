import { Graphics, Container } from "pixi.js";
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
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private createHTMLCard() {

    const uiLayer = document.getElementById("ui-layer")!;

    this.card = document.createElement("div");
    this.card.className = "bet-card";

    this.card.innerHTML = `
        <div style="font-size:18px;font-weight:600;margin-bottom:10px">
          BET PANEL
        </div>

        <input 
          type="number" 
          placeholder="Enter Amount"
          style="width:100%;padding:8px;border-radius:8px;border:none;margin-bottom:10px"
        />

        <button 
          style="width:100%;padding:10px;border-radius:10px;border:none;background:#22c55e;color:white;font-weight:600;cursor:pointer"
        >
          PLACE BET
        </button>
    `;

    uiLayer.appendChild(this.card);
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

    // optional panel bg
    this.bg.clear()
      .roundRect(0, 0, panelWidth, panelHeight, 20)
      .fill(0x1a1a1a);

    // ⭐⭐⭐ IMPORTANT → sync HTML with PIXI container
    const global = this.getGlobalPosition();

    this.card.style.left = global.x + "px";
    this.card.style.top = global.y + "px";
    this.card.style.width = panelWidth + "px";
    this.card.style.height = panelHeight + "px";
  }
}