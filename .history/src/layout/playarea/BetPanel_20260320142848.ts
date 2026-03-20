import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { CrashGameStore } from "../../store/GameStore";
import { Header } from "../Header";
export class BetPanel extends Container {
  private bg!: Graphics;
  private card!: HTMLDivElement;
  private store = CrashGameStore.instance;
  private betAmount = 1;
  private panelWidth = 0;
private panelHeight = 0;

  constructor() {
    super();

    this.init();
    this.createHTMLCard();
    this.layout();
    this.updateFromStore();
    this.store.subscribe(() => this.updateFromStore());
    // window.addEventListener("resize", () => this.layout());

    //  IMPORTANT → sync DOM every frame
    Ticker.shared.add(this.updateDOMPosition, this);
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  private wrapper!: HTMLDivElement;
  private updateFromStore() {
    const s = this.store;

    const cards = this.wrapper.querySelectorAll(".bet-card-ui");

    cards.forEach((card) => {
      const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;
      const title = card.querySelector(".bc-bet-title")!;
      const amt = card.querySelector(".bc-bet-amt")!;
      const amtDisplay = card.querySelector(".bc-amount")!;

      amtDisplay.textContent = s.betAmount.toFixed(2);

      //  WAITING
      if (s.phase === "WAITING") {
        if (s.autoBetEnabled) {
          btn.className = "bc-bet-btn bc-state-bet";
          title.textContent = "Auto Bet";
          amt.textContent = s.betAmount.toFixed(2) + " USD";

          btn.onclick = () => {
            if (s.scheduledBet) {
              s.cancelScheduledBet();
            } else {
              s.scheduleBet();
            }
          };
        } else {
          btn.className = "bc-bet-btn bc-state-bet";

          if (s.hasBet) {
            title.textContent = "Cancel";
            amt.textContent = s.currentRoundBet.toFixed(2) + " USD";
            btn.onclick = () => s.cancelBet();
          } else {
            title.textContent = "Bet";
            amt.textContent = s.betAmount.toFixed(2) + " USD";
            btn.onclick = () => s.placeBet();
          }
        }
      }

      //  FLYING
      else if (s.phase === "FLYING") {
        if (s.hasBet && !s.hasCashedOut) {
          btn.className = "bc-bet-btn bc-state-cashout";
          title.textContent = "Cashout";
          amt.textContent = s.liveWinAmount.toFixed(2) + " USD";

          btn.onclick = () => s.cashOut();
        } else {
          btn.className = "bc-bet-btn bc-state-bet";

          if (s.scheduledBet) {
            title.textContent = "Cancel";
            amt.textContent = "Waiting next round";
            btn.onclick = () => s.cancelScheduledBet();
          } else {
            title.textContent = s.autoBetEnabled ? "Auto Bet" : "Bet";
            amt.textContent = s.betAmount.toFixed(2) + " USD";
            btn.onclick = () => s.scheduleBet();
          }
        }
      }

      //  CRASHED
     else if (s.phase === "CRASHED") {

  btn.className = "bc-bet-btn bc-state-disabled"

  if (s.scheduledBet) {
    title.textContent = "Cancel"
    amt.textContent = "Waiting next round"
  }
  else if (s.autoBetEnabled) {
    title.textContent = "Auto Bet"
    amt.textContent = s.betAmount.toFixed(2) + " USD"
  }
  else {
    title.textContent = "Bet"
    amt.textContent = s.betAmount.toFixed(2) + " USD"
  }

  btn.onclick = null
}

      //  CASHED
      else if (s.phase === "CASHED_OUT") {
        btn.className = "bc-bet-btn bc-state-success";
        title.textContent = "Cashed";
        amt.textContent = s.winAmount + " USD";
        btn.onclick = null;
      }

      const pill = card.querySelector(".bc-switch-pill") as HTMLElement;

      if (s.autoBetEnabled) {
        pill.classList.add("bc-auto-active");
      } else {
        pill.classList.remove("bc-auto-active");
      }

      if (s.scheduledBet) {
        pill.style.opacity = "0.5";
        pill.style.pointerEvents = "none";
      } else {
        pill.style.opacity = "1";
        pill.style.pointerEvents = "auto";
      }
      const amountControls = card.querySelector(".bc-middle-row") as HTMLElement;

      const shouldLockAmount =
        s.scheduledBet || // bet scheduled
        (s.hasBet && !s.hasCashedOut); // current round active bet

      if (shouldLockAmount) {
        amountControls.style.opacity = "0.4";
        amountControls.style.pointerEvents = "none";
      } else {
        amountControls.style.opacity = "1";
        amountControls.style.pointerEvents = "auto";
      }
      const toggle = card.querySelector(".bc-toggle") as HTMLElement;

if (s.autoCashoutEnabled) {
  toggle.classList.add("bc-active");
} else {
  toggle.classList.remove("bc-active");
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
      <div class="bc-switch-highlight"></div>
      <div class="bc-switch-tab bc-tab-bet active">Bet</div>
      <div class="bc-switch-tab bc-tab-auto">Auto</div>
   </div>
</div>

<div class="bc-content">

   <div class="bc-middle-row">

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

   <div class="bc-bet-row">
      <button class="bc-bet-btn bc-state-normal">
         <span class="bc-bet-title">Bet</span>
         <span class="bc-bet-amt">1.00 USD</span>
      </button>
   </div>
<div class="bc-autocash-row">

   <div class="bc-autocash-left">
      <span class="bc-autocash-label">Auto Cashout</span>
   </div>

   <div class="bc-autocash-right">

      <div class="bc-autocash-input">
         <input class="bc-autocash-val" value="2.00" />
         <span class="bc-autocash-x">x</span>
      </div>

      <div class="bc-toggle">
         <div class="bc-toggle-knob"></div>
      </div>

   </div>

</div>
`;

    this.wrapper.appendChild(card);
card.style.width = "100%";
card.style.flexShrink = "0";
    // ✅ NOW query after HTML exists
    const betTab = card.querySelector(".bc-tab-bet") as HTMLElement;
    const autoTab = card.querySelector(".bc-tab-auto") as HTMLElement;
    const pill = card.querySelector(".bc-switch-pill") as HTMLElement;

    betTab.onclick = () => {
      if (this.store.scheduledBet) return;
      this.store.setAutoBet(false);
    };

    autoTab.onclick = () => {
      if (this.store.scheduledBet) return;
      this.store.setAutoBet(true);
    };

    // amount controls
    const minus = card.querySelector(".bc-minus")!;
    const plus = card.querySelector(".bc-plus")!;
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
      


const toggle = card.querySelector(".bc-toggle") as HTMLElement;
const autoInput = card.querySelector(".bc-autocash-val") as HTMLInputElement;
autoInput.addEventListener("input", () => {

  // allow only numbers + one decimal
  autoInput.value = autoInput.value
    .replace(/[^\d.]/g, "")        // remove non digits
    .replace(/(\..*)\./g, "$1")    // allow only one dot

    if (autoInput.value>20){
      
    }

});
toggle.onclick = () => {

  let v = Number(autoInput.value)

  if (isNaN(v) || v < 1.01) v = 1.01
  if (v > 1000) v = 1000

  this.store.toggleAutoCashout(v)
};

autoInput.onchange = () => {

  let v = Number(autoInput.value)

  if (isNaN(v) || v < 1.01) v = 1.01
  if (v > 1000) v = 1000

  autoInput.value = v.toFixed(2)

  if (this.store.autoCashoutEnabled) {
    this.store.setAutoCashoutMultiplier(v)
  }
};
    });
  }
  
private updateDOMPosition = () => {

  const global = this.getGlobalPosition();

const width = this.panelWidth;
const height = this.panelHeight;

  this.wrapper.style.left = global.x + "px";
  this.wrapper.style.top = global.y + "px";
  this.wrapper.style.width = width + "px";
  this.wrapper.style.height = height + "px";

  // ⭐ NEW → vertical panel behaviour
  this.wrapper.style.flexDirection = "column";
this.wrapper.style.alignItems = "stretch";
this.wrapper.style.justifyContent = "flex-start";
this.wrapper.style.gap = "12px";
this.wrapper.style.gap = "0px";                        // spacing now auto handled
  this.wrapper.style.padding = "12px";
  this.wrapper.style.boxSizing = "border-box";
  this.wrapper.style.overflowY = "auto";   // ⭐ panel grows DOWN
};

layout(width?: number, height?: number) {

  if (!width || !height) return;

  this.bg.clear()
    .roundRect(0, 0, width, height, 20)
    .fill(0x1a1a1a);
}
public resize(width: number, height: number) {

  this.panelWidth = width;
  this.panelHeight = height;

  this.layout(width, height);
}
}
