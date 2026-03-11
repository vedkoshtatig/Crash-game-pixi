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
    this.bindGameEvents();
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private wrapper!: HTMLDivElement;
private bindGameEvents() {

  // ⭐ WAITING TIMER
  gameEvents.on("round:waiting", () => {

    this.isWaiting = true;
    this.isFlying = false;

    this.cards.forEach((card, i) => {
      this.hasBet[i] = false;
      this.setButtonState(card, "normal");
      card.style.opacity = "1";
      card.style.pointerEvents = "auto";
    });

  });

  // ⭐ ROUND START (plane takeoff)
  gameEvents.on("round:start", () => {

    this.isWaiting = false;
    this.isFlying = true;

    this.cards.forEach((card, i) => {

      if (this.hasBet[i]) {
        this.setButtonState(card, "cashout", 1);
      } else {
        this.setButtonState(card, "normal");
      }

    });

  });

  // ⭐ MULTIPLIER UPDATE
  gameEvents.on("plane:update", ({ multiplier }) => {

    this.cards.forEach((card, i) => {
      if (this.hasBet[i]) {
        this.setButtonState(card, "cashout", multiplier);
      }
    });

  });

  // ⭐ CRASH
  gameEvents.on("plane:crash", () => {

    this.isFlying = false;
    this.isWaiting = false;

    this.cards.forEach((card) => {
      card.style.opacity = "0.5";
      card.style.pointerEvents = "none";
    });

  });

}
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

  // ⭐ WAITING PHASE → place bet for THIS round
  if (this.isWaiting) {
    console.log("BET PLACED FOR CURRENT ROUND");

    this.hasBet[index] = true;

    // ⭐ show locked / waiting confirmation UI
    this.setButtonState(card, "schedule"); 
    // (optional → later you can create "locked" state)
  }

  // ⭐ FLYING + already bet → CASHOUT
  else if (this.isFlying && this.hasBet[index]) {
    console.log("CASHOUT CLICK");

    // later → socket.emit("cashout")
    this.hasBet[index] = false; // prevent double cashout
  }

  // ⭐ FLYING + no bet → schedule next round
  else if (this.isFlying && !this.hasBet[index]) {
    console.log("BET SCHEDULED FOR NEXT ROUND");

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
