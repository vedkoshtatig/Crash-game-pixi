import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";

export class BetPanel extends Container {

  private bg!: Graphics;
  private wrapper!: HTMLDivElement;

  private cards: HTMLElement[] = [];
  private hasBet: boolean[] = [];

  private isWaiting = false;
  private isFlying = false;

  constructor() {
    super();

    this.init();
    this.createHTMLCard();
    this.layout();

    window.addEventListener("resize", () => this.layout());

    Ticker.shared.add(this.updateDOMPosition, this);

    this.bindGameEvents();
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private createHTMLCard() {
    const uiLayer = document.getElementById("ui-layer")!;

    this.wrapper = document.createElement("div");
    this.wrapper.className = "bet-panel-wrapper";

    uiLayer.appendChild(this.wrapper);

    this.addBetCard();
    this.addBetCard();
  }

  public addBetCard() {

    const card = document.createElement("div");
    card.className = "bet-card-ui";

    card.innerHTML = `
<div class="bc-top-switch">
   <div class="bc-switch-pill">
      <div class="bc-switch-active">Bet</div>
      <div>Auto</div>
   </div>
</div>

<div class="bc-content">
   <div class="bc-left">
      <div class="bc-amount-row">
         <div class="bc-circle">−</div>
         <div class="bc-amount">1.00</div>
         <div class="bc-circle">+</div>
      </div>

      <div class="bc-quick">
         <div>1</div>
         <div>2</div>
         <div>5</div>
         <div>10</div>
      </div>
   </div>

   <button class="bc-bet-btn bc-state-normal">
      <span class="bc-bet-title">Bet</span>
      <span class="bc-bet-amt">1.00 USD</span>
   </button>
</div>
`;

    this.wrapper.appendChild(card);

    const index = this.cards.length;

    this.cards.push(card);
    this.hasBet.push(false);

    const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;

    btn.addEventListener("click", () => {

      // ⭐ WAITING → place bet current round
      if (this.isWaiting) {
        console.log("BET PLACED CURRENT ROUND");

        this.hasBet[index] = true;
        this.setButtonState(card, "schedule");
      }

      // ⭐ FLYING + active bet → CASHOUT
      else if (this.isFlying && this.hasBet[index]) {
        console.log("CASHOUT CLICK");

        this.hasBet[index] = false;
        // socket emit later
      }

      // ⭐ FLYING + no bet → schedule next
      else if (this.isFlying && !this.hasBet[index]) {
        console.log("BET SCHEDULED NEXT ROUND");

        this.hasBet[index] = true;
        this.setButtonState(card, "schedule");
      }

    });

  }

  private bindGameEvents() {

    // ⭐ WAITING PHASE
    gameEvents.on("round:waiting", () => {

      this.isWaiting = true;
      this.isFlying = false;

      this.cards.forEach((card, i) => {

        this.hasBet[i] = false;

        card.style.opacity = "1";
        card.style.pointerEvents = "auto";

        this.setButtonState(card, "normal");
      });

    });

    // ⭐ FLIGHT START
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

    this.bg.clear()
      .roundRect(0, 0, panelWidth, panelHeight, 20)
      .fill(0x1a1a1a);

  }

}