import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { CrashGameStore } from "../../store/GameStore";

export class BetPanel extends Container {
  private bg!: Graphics;
  private store = CrashGameStore.instance;
  private wrapper!: HTMLDivElement;
private targetCardCount = 1;     // what UI SHOULD have
private currentCardCount = 0;    // what DOM HAS
  constructor() {
    super();

    this.init();
    this.createHTMLCard();
    this.layout();
    this.updateFromStore();

    this.store.subscribe(() => this.updateFromStore());
    window.addEventListener("resize", () => this.layout());

    Ticker.shared.add(this.updateDOMPosition, this);
  }

  init() {
    this.bg = new Graphics();
    this.addChild(this.bg);
  }

  // STORE → UI RENDER
  private updateFromStore() {
    const s = this.store;
    const cards =
      this.wrapper.querySelectorAll<HTMLDivElement>(".bet-card-ui");

   cards.forEach((card) => {

  const id = card.dataset.id!;
  const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;
  const title = card.querySelector(".bc-bet-title") as HTMLElement;
  const amt = card.querySelector(".bc-bet-amt") as HTMLElement;
  const pill = card.querySelector(".bc-switch-pill") as HTMLElement;
  const amountControls = card.querySelector(".bc-left") as HTMLElement;

  const isActive = s.activeBets.has(id);
  const isScheduled = s.scheduledBets.has(id);
  const isCashed = s.cashedOutCards.has(id);
  const lostOnCrash =
    s.phase === "CRASHED" && isActive && !isCashed;

  /* =========================
     1️⃣ CASHED RESULT (highest priority)
  ==========================*/
  if (isCashed) {

    btn.className = "bc-bet-btn bc-state-success";
    title.textContent = "Cashed";

    const win = s.winAmounts.get(id) ?? 0;
    amt.textContent = win.toFixed(2) + " USD";

  }

  /* =========================
     2️⃣ LOST ON CRASH (freeze visual)
  ==========================*/
  else if (lostOnCrash) {

    btn.classList.add("bc-state-disabled");

    if (title.textContent === "Cashout") {

      const previewAmt =
        card.querySelector(".bc-amount")?.textContent || "1.00";

      btn.className = "bc-bet-btn bc-state-disabled";

      title.textContent = pill.classList.contains("bc-auto-active")
        ? "Auto Bet"
        : "Bet";

      amt.textContent = previewAmt + " USD";
    }
  }

  /* =========================
     3️⃣ ACTIVE DURING FLYING
  ==========================*/
  else if (s.phase === "FLYING" && isActive) {

    btn.className = "bc-bet-btn bc-state-cashout";
    title.textContent = "Cashout";
    amt.textContent =
      s.liveWinAmount(id).toFixed(2) + " USD";

  }

  /* =========================
     4️⃣ ACTIVE DURING WAITING
  ==========================*/
  else if (s.phase === "WAITING" && isActive) {

    btn.className = "bc-bet-btn bc-state-bet";
    title.textContent = "Cancel";
    amt.textContent =
      (s.activeBets.get(id) ?? 0).toFixed(2) + " USD";

  }

  /* =========================
     5️⃣ SCHEDULED
  ==========================*/
  else if (isScheduled) {

    btn.className = "bc-bet-btn bc-state-bet";
    title.textContent = "Cancel";
    amt.textContent = "Waiting next round";

  }

  /* =========================
     6️⃣ DEFAULT PREVIEW
  ==========================*/
  else {

    btn.className = "bc-bet-btn bc-state-normal";

    const previewAmt =
      card.querySelector(".bc-amount")?.textContent || "1.00";

    title.textContent = pill.classList.contains("bc-auto-active")
      ? "Auto Bet"
      : "Bet";

    amt.textContent = previewAmt + " USD";
  }

  /* =========================
     LOCK INPUTS
  ==========================*/
  const lock = isActive || isScheduled;

  pill.style.opacity = lock ? "0.5" : "1";
  pill.style.pointerEvents = lock ? "none" : "auto";

  amountControls.style.opacity = lock ? "0.4" : "1";
  amountControls.style.pointerEvents = lock ? "none" : "auto";

});
  }

  // CREATE PANEL
 private createHTMLCard() {
  const uiLayer = document.getElementById("ui-layer")!;

  this.wrapper = document.createElement("div");
  this.wrapper.className = "bet-panel-wrapper";

  uiLayer.appendChild(this.wrapper);

  this.syncCards();   // ← important
}
private syncCards() {

  while (this.currentCardCount < this.targetCardCount) {
    this.addBetCard();
    this.currentCardCount++;
  }

  while (this.currentCardCount > this.targetCardCount) {
    const cards = this.wrapper.querySelectorAll(".bet-card-ui");
    cards[cards.length - 1]?.remove();
    this.currentCardCount--;
  }
}

  // ADD SINGLE CARD
  public addBetCard() {
    const cardId = crypto.randomUUID();

    const card = document.createElement("div");
    card.className = "bet-card-ui";
    card.dataset.id = cardId;

    let localAuto = false;
    let localAmount = this.store.betAmount;

    card.innerHTML = `
<div class="bc-top-switch">
   <div class="bc-switch-pill">
      <div class="bc-switch-highlight"></div>
      <div class="bc-switch-tab bc-tab-bet active">Bet</div>
      <div class="bc-switch-tab bc-tab-auto">Auto</div>
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

    const amountEl = card.querySelector(".bc-amount") as HTMLElement;
    const titleEl = card.querySelector(".bc-bet-title") as HTMLElement;
    const amtEl = card.querySelector(".bc-bet-amt") as HTMLElement;
    const pill = card.querySelector(".bc-switch-pill") as HTMLElement;

    const render = () => {
      amountEl.textContent = localAmount.toFixed(2);
      amtEl.textContent = localAmount.toFixed(2) + " USD";
      titleEl.textContent = localAuto ? "Auto Bet" : "Bet";

      if (localAuto) pill.classList.add("bc-auto-active");
      else pill.classList.remove("bc-auto-active");
    };

    render();

    // MODE SWITCH
    card.querySelector(".bc-tab-bet")!.addEventListener("click", () => {
      localAuto = false;
      render();
    });

    card.querySelector(".bc-tab-auto")!.addEventListener("click", () => {
      localAuto = true;
      render();
    });

    // AMOUNT
    card.querySelector(".bc-minus")!.addEventListener("click", () => {
      localAmount = Math.max(1, localAmount - 1);
      render();
    });

    card.querySelector(".bc-plus")!.addEventListener("click", () => {
      localAmount += 1;
      render();
    });

    card.querySelectorAll(".bc-q").forEach((q) => {
      q.addEventListener("click", () => {
        localAmount = Number(q.getAttribute("data-val"));
        render();
      });
    });

    // BET BUTTON
    card.querySelector(".bc-bet-btn")!.addEventListener("click", () => {
      const s = this.store;

      // WAITING
      if (s.phase === "WAITING") {
       if (s.activeBets.has(cardId)) {
          s.cancelBet(cardId);
        } else {
          s.placeBet(localAmount, cardId);
        }
      }

      // FLYING
      else if (s.phase === "FLYING") {
       if (s.activeBets.has(cardId) && !s.cashedOutCards.has(cardId)) {
   s.cashOut(cardId);
   return;
}

        if (s.scheduledBets.has(cardId)) {
          s.cancelScheduledBet(cardId);
          return;
        }

        s.scheduleBet(localAmount, cardId);
      }
    });
  }
private adjustCards(panelWidth: number) {

  const { width } = app.screen;

  // ⭐ only collapse in real mobile
  const isMobileView = width <= 780;

  const newTarget = isMobileView ? 1 : 1;

  if (newTarget !== this.targetCardCount) {
    this.targetCardCount = newTarget;
    this.syncCards();
  }
}
  private updateDOMPosition = () => {

  const { width, height } = app.screen;

  const isMobile = width < 780;

  const sidebarWidth = width / 3.6;
  const headerHeight = height / 18;
  const betHistoryHeight = height / 18;
  const flyAreaHeight = height / 1.55;

  let panelWidth;
  let panelHeight;
  let y;

  if (isMobile) {

    panelWidth = width;
    y = this.y;                 // use container global
    panelHeight = height - y;

  } else {

    panelWidth = width - sidebarWidth;
    y = headerHeight + betHistoryHeight + flyAreaHeight;
    panelHeight = height - y;

  }

  const global = this.getGlobalPosition();

  this.wrapper.style.left = global.x + "px";
  this.wrapper.style.top = global.y + "px";
  this.wrapper.style.width = panelWidth + "px";
  this.wrapper.style.height = panelHeight + "px";
this.adjustCards(panelWidth);
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

    this.bg
      .clear()
      .roundRect(0, 0, panelWidth, panelHeight, 20)
      .fill(0x1a1a1a);
  }
  public resize(panelWidth: number) {

  if (!this.wrapper) return;

  this.wrapper.style.width = panelWidth + "px";

  // OPTIONAL → responsive card layout
  if (panelWidth < 600) {
    this.wrapper.style.flexDirection = "column";
  } else {
    this.wrapper.style.flexDirection = "row";
  }
}
}