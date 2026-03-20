import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { CrashGameStore } from "../../store/GameStore";

export class BetPanel extends Container {
  private bg!: Graphics;
  private store = CrashGameStore.instance;
  private wrapper!: HTMLDivElement;

  private targetCardCount = 1;
  private currentCardCount = 0;

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

  /* =========================
     STORE → UI RENDER
  ==========================*/
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

      /* ===== 1️⃣ CASHED ===== */
      if (isCashed) {
        btn.className = "bc-bet-btn bc-state-success";
        title.textContent = "Cashed";
        const win = s.winAmounts.get(id) ?? 0;
        amt.textContent = win.toFixed(2) + " USD";
      }

      /* ===== 2️⃣ ACTIVE FLYING ===== */
      else if (s.phase === "FLYING" && isActive) {
        btn.className = "bc-bet-btn bc-state-cashout";
        title.textContent = "Cashout";
        amt.textContent =
          s.liveWinAmount(id).toFixed(2) + " USD";
      }

      /* ===== 3️⃣ ACTIVE WAITING ===== */
      else if (s.phase === "WAITING" && isActive) {
        btn.className = "bc-bet-btn bc-state-bet";
        title.textContent = "Cancel";
        amt.textContent =
          (s.activeBets.get(id) ?? 0).toFixed(2) + " USD";
      }

      /* ===== 4️⃣ SCHEDULED ===== */
      else if (isScheduled) {
        btn.className = "bc-bet-btn bc-state-bet";
        title.textContent = "Cancel";
        amt.textContent = "Waiting next round";
      }

      /* ===== 5️⃣ LOST FREEZE ===== */
      else if (lostOnCrash) {
        btn.className = "bc-bet-btn bc-state-disabled";
        title.textContent = "Bet";
        amt.textContent =
          (s.activeBets.get(id) ?? 0).toFixed(2) + " USD";
      }

      /* ===== 6️⃣ DEFAULT ===== */
      else {
        btn.className = "bc-bet-btn bc-state-normal";

        const preview =
          card.querySelector(".bc-amount")?.textContent || "1.00";

        title.textContent = pill.classList.contains("bc-auto-active")
          ? "Auto Bet"
          : "Bet";

        amt.textContent = preview + " USD";
      }

      /* ===== INPUT LOCK ===== */
      const lock = isActive || isScheduled;

      pill.style.opacity = lock ? "0.5" : "1";
      pill.style.pointerEvents = lock ? "none" : "auto";

      amountControls.style.opacity = lock ? "0.4" : "1";
      amountControls.style.pointerEvents = lock ? "none" : "auto";

      /* ===== BUTTON ACTION ===== */
      btn.onclick = () => {
        if (s.phase === "WAITING") {
          if (isActive) s.cancelBet(id);
          else s.placeBet(
            Number(
              card.querySelector(".bc-amount")!.textContent
            ),
            id
          );
        } else if (s.phase === "FLYING") {
          if (isActive && !isCashed) {
            s.cashOut(id);
            return;
          }

          if (isScheduled) {
            s.cancelScheduledBet(id);
            return;
          }

          s.scheduleBet(
            Number(
              card.querySelector(".bc-amount")!.textContent
            ),
            id
          );
        }
      };
    });
  }

  /* =========================
     DOM CREATE
  ==========================*/
  private createHTMLCard() {
    const uiLayer = document.getElementById("ui-layer")!;

    this.wrapper = document.createElement("div");
    this.wrapper.className = "bet-panel-wrapper";

    uiLayer.appendChild(this.wrapper);

    this.syncCards();
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

  public addBetCard() {
    const cardId = crypto.randomUUID();

    const card = document.createElement("div");
    card.className = "bet-card-ui";
    card.dataset.id = cardId;

    card.innerHTML = `... SAME YOUR HTML ...`;

    this.wrapper.appendChild(card);
  }

  /* =========================
     RESPONSIVE
  ==========================*/
  private adjustCards(panelWidth: number) {
    const { width } = app.screen;
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
      y = this.y;
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
}