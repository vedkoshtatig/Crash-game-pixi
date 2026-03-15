import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { CrashGameStore } from "../../store/GameStore";
import { Header } from "../Header";
export class BetPanel extends Container {
  private bg!: Graphics;
  private card!: HTMLDivElement;
  private store = CrashGameStore.instance;
  private betAmount = 1;
  constructor() {
    super();

    this.init();
    this.createHTMLCard();
    this.layout();
    this.updateFromStore();
    this.store.subscribe(() => this.updateFromStore());
    window.addEventListener("resize", () => this.layout());

    // ⭐ IMPORTANT → sync DOM every frame
    Ticker.shared.add(this.updateDOMPosition, this);
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private wrapper!: HTMLDivElement;
  private updateFromStore() {
    const phase = this.store.phase;
    const hasBet = this.store.hasBet;
    const multiplier = this.store.multiplier;

    const cards = this.wrapper.querySelectorAll(".bet-card-ui");

   cards.forEach((card) => {
  const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;
  const title = card.querySelector(".bc-bet-title")!;
  const amt = card.querySelector(".bc-bet-amt")!;
  const amtDisplay = card.querySelector(".bc-amount")!;

  amtDisplay.textContent = this.store.betAmount.toFixed(2);

      // ⭐ WAITING STATE
      if (phase === "WAITING") {
        btn.className = "bc-bet-btn bc-state-bet";

        title.textContent = hasBet ? "Cancel" : "Bet";
       amt.textContent =
   (this.store.currentRoundBet * multiplier).toFixed(2) + " USD";

        btn.onclick = () => {
          if (this.store.hasBet) {
            this.store.cancelBet();
          } else {
           this.store.placeBet();
           console.log( this.store.balance);
          }
        };
      }

      // ⭐ FLYING STATE
      else if (phase === "FLYING") {
        if (hasBet && !this.store.hasCashedOut) {
          btn.className = "bc-bet-btn bc-state-cashout";
          title.textContent = "Cashout";
          amt.textContent =
            (this.store.betAmount * multiplier).toFixed(2) + " USD";

          btn.onclick = () => this.store.cashOut();
        } else {
          btn.className = "bc-bet-btn bc-state-disabled";
          title.textContent = "Flying";
          amt.textContent=""
        }
      }

      // ⭐ CRASHED STATE
      else if (phase === "CRASHED") {
        btn.className = "bc-bet-btn bc-state-disabled";
        title.textContent = "Crashed";
      }

      // ⭐ CASHED OUT STATE
      else if (phase === "CASHED_OUT") {
        btn.className = "bc-bet-btn bc-state-success";
        title.textContent = "Cashed";
        amt.textContent = this.store.winAmount.toFixed(2) + " USD";
      }
    });
  }
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
<div class="bc-top-switch">
   <div class="bc-switch-pill">
      <div class="bc-switch-active">Bet</div>
      <div>Auto</div>
   </div>
</div>

<div class="bc-content">

   <div class="bc-left">

      <div class="bc-amount-row">
         <div class="bc-circle bc-minus">−</div>
         <div class="bc-amount">1.00</div>
         <div class="bc-circle bc-plus">+</div>
      </div>

      <div class="bc-quick">
         <div class="bc-q" data-val="1">1</div>
         <div class="bc-q" data-val="2">2</div>
         <div class="bc-q" data-val="5">5</div>
         <div class="bc-q" data-val="10">10</div>
      </div>

   </div>

<button class="bc-bet-btn bc-state-normal">
   <span class="bc-bet-title">Bet</span>
   <span class="bc-bet-amt">1.00 USD</span>
</button>

</div>
`;

  this.wrapper.appendChild(card);

  // ⭐ attach amount controls
  const minus = card.querySelector(".bc-minus")!;
  const plus = card.querySelector(".bc-plus")!;
  const amountText = card.querySelector(".bc-amount")!;
  const quickBtns = card.querySelectorAll(".bc-q");

  minus.addEventListener("click", () => {
    this.store.setBetAmount(Math.max(1, this.store.betAmount - 1));
  });

  plus.addEventListener("click", () => {
    this.store.setBetAmount(this.store.betAmount + 1);
  });

  quickBtns.forEach((q) => {
    q.addEventListener("click", () => {
      const val = Number(q.getAttribute("data-val"));
      this.store.setBetAmount(val);
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
