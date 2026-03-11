import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";
export class BetPanel extends Container {
  private bg!: Graphics;
  private card!: HTMLDivElement;
private cards: HTMLElement[] = [];
private hasBet: boolean[] = [];
private isFlying = false;
private isWaiting = false;
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
    this.addBetCard();
  }
 public addBetCard() {
  const card = document.createElement("div");
  card.className = "bet-card-ui";

  card.innerHTML = ` ... same html ... `;

  this.wrapper.appendChild(card);

  const index = this.cards.length;

  this.cards.push(card);
  this.hasBet.push(false);

  const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;

  btn.addEventListener("click", () => {

    if (this.isWaiting) {
      console.log("BET PLACED");
      this.hasBet[index] = true;
      this.setButtonState(card, "schedule");
    }

    else if (this.isFlying && this.hasBet[index]) {
      console.log("CASHOUT CLICK");
      // socket emit cashout here later
    }

    else if (this.isFlying && !this.hasBet[index]) {
      console.log("SCHEDULE NEXT ROUND");
      this.hasBet[index] = true;
      this.setButtonState(card, "schedule");
    }

  });
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

    this.wrapper.style.left = global.x + "px";
    this.wrapper.style.top = global.y + "px";
    this.wrapper.style.width = panelWidth + "px";
    this.wrapper.style.height = panelHeight + "px";
  };
public setButtonState(
  card: HTMLElement,
  state: "normal" | "schedule" | "cashout",
  multiplier?: number
) {
  const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;
  const title = btn.querySelector(".bc-bet-title") as HTMLElement;
  const amt = btn.querySelector(".bc-bet-amt") as HTMLElement;

  btn.classList.remove(
    "bc-state-normal",
    "bc-state-schedule",
    "bc-state-cashout"
  );

  if (state === "normal") {
    btn.classList.add("bc-state-normal");
    title.innerText = "Bet";
    amt.innerText = "1.00 USD";
    amt.style.display = "block";
  }

  if (state === "schedule") {
    btn.classList.add("bc-state-schedule");
    title.innerText = "Scheduled";
    amt.style.display = "none";
  }

  if (state === "cashout") {
    btn.classList.add("bc-state-cashout");
    title.innerText = "Cashout";
    amt.innerText = `${multiplier?.toFixed(2)}x`;
    amt.style.display = "block";
  }
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

    this.bg.clear().roundRect(0, 0, panelWidth, panelHeight, 20).fill(0x1a1a1a);
  }
}
