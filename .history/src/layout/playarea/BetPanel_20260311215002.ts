import { Graphics, Container } from "pixi.js";
import { app } from "../../main";

export class BetPanel extends Container {

  private bg!: Graphics;
  private card!: HTMLDivElement;
  private card!: HTMLDivElement;

private createCard(){
   const container = document.getElementById("pixi-container")!;

   this.card = document.createElement("div");
   this.card.className = "bet-card";

   this.card.innerHTML = `
      <div class="title">BET</div>
      <input class="amount" placeholder="Enter amount" />
      <button class="place">PLACE BET</button>
   `;

   container.appendChild(this.card);
}

  constructor() {
    super();

    this.init();
    this.createHTML();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  createHTML() {

    const ui = document.getElementById("ui-layer")!;

    this.card = document.createElement("div");
    this.card.className = "bet-card";

    this.card.innerHTML = `
        <h3>BET</h3>
        <input type="number" placeholder="Amount" style="width:100%">
        <button style="margin-top:10px;width:100%">PLACE BET</button>
    `;

    ui.appendChild(this.card);
  }

  layout() {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const headerHeight = height / 18;
    const betHistoryHeight = height / 18;
    const flyAreaHeight = height /1.55;

    const y = headerHeight + betHistoryHeight + flyAreaHeight;
    const panelHeight = height - y;

    this.bg.clear()
.roundRect(0,0,width - sidebarWidth,panelHeight,20)
.stroke({ width:2, color:0x222222 })

    // 🔥 POSITION HTML CARD EXACTLY WITH PIXI PANEL
    const global = this.getGlobalPosition();

    this.card.style.left = global.x + 20 + "px";
    this.card.style.top = global.y + 20 + "px";
  }
}