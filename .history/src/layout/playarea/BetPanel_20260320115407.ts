import { Graphics, Container, Ticker } from "pixi.js";
import { app } from "../../main";
import { CrashGameStore } from "../../store/GameStore";
import { Header } from "../Header";

export class BetPanel extends Container {
  private bg!: Graphics;
  private card!: HTMLDivElement;
  private store = CrashGameStore.instance;
  private betAmount = 1;

  private wrapper!: HTMLDivElement;

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

  private updateFromStore() {
    const s = this.store;
    const cards = this.wrapper.querySelectorAll(".bet-card-ui");

    cards.forEach((card) => {
      const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement;
      const title = card.querySelector(".bc-bet-title")!;
      const amt = card.querySelector(".bc-bet-amt")!;
      const amtDisplay = card.querySelector(".bc-amount")!;

      amtDisplay.textContent = s.betAmount.toFixed(2);

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
            amt.textContent =
              s.currentRoundBet.toFixed(2) + " USD";
            btn.onclick = () => s.cancelBet();
          } else {
            title.textContent = "Bet";
            amt.textContent = s.betAmount.toFixed(2) + " USD";
            btn.onclick = () => s.placeBet();
          }
        }
      } else if (s.phase === "FLYING") {
        if (s.hasBet && !s.hasCashedOut) {
          btn.className = "bc-bet-btn bc-state-cashout";
          title.textContent = "Cashout";
          amt.textContent =
            s.liveWinAmount.toFixed(2) + " USD";

          btn.onclick = () => s.cashOut();
        } else {
          btn.className = "bc-bet-btn bc-state-bet";

          if (s.scheduledBet) {
            title.textContent = "Cancel";
            amt.textContent = "Waiting next round";
            btn.onclick = () => s.cancelScheduledBet();
          } else {
            title.textContent = s.autoBetEnabled
              ? "Auto Bet"
              : "Bet";
            amt.textContent = s.betAmount.toFixed(2) + " USD";
            btn.onclick = () => s.scheduleBet();
          }
        }
      } else if (s.phase === "CRASHED") {
        btn.className = "bc-bet-btn bc-state-disabled";

        if (s.scheduledBet) {
          title.textContent = "Cancel";
          amt.textContent = "Waiting next round";
        } else if (s.autoBetEnabled) {
          title.textContent = "Auto Bet";
          amt.textContent =
            s.betAmount.toFixed(2) + " USD";
        } else {
          title.textContent = "Bet";
          amt.textContent =
            s.betAmount.toFixed(2) + " USD";
        }

        btn.onclick = null;
      } else if (s.phase === "CASHED_OUT") {
        btn.className = "bc-bet-btn bc-state-success";
        title.textContent = "Cashed";
        amt.textContent = s.winAmount + " USD";
        btn.onclick = null;
      }

      const pill = card.querySelector(
        ".bc-switch-pill"
      ) as HTMLElement;

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

      const amountControls = card.querySelector(
        ".bc-left"
      ) as HTMLElement;

      const shouldLockAmount =
        s.scheduledBet || (s.hasBet && !s.hasCashedOut);

      if (shouldLockAmount) {
        amountControls.style.opacity = "0.4";
        amountControls.style.pointerEvents = "none";
      } else {
        amountControls.style.opacity = "1";
        amountControls.style.pointerEvents = "auto";
      }
    });
  }

  private createHTMLCard() {
    const uiLayer = document.getElementById("ui-layer")!;

    this.wrapper = document.createElement("div");
    this.wrapper.className = "bet-panel-wrapper";

    uiLayer.appendChild(this.wrapper);

    this.addBetCard();
  }

  public addBetCard() {
    const card = document.createElement("div");
    card.className = "bet-card-ui";

    card.innerHTML = `... SAME HTML ...`;

    this.wrapper.appendChild(card);

  const betTab = card.querySelector(".bc-tab-bet") as HTMLElement | null;
const autoTab = card.querySelector(".bc-tab-auto") as HTMLElement | null;

if (!betTab || !autoTab) {
  console.error("BetPanel UI tabs not found");
  return;
}

    betTab.onclick = () => {
      if (this.store.scheduledBet) return;
      this.store.setAutoBet(false);
    };

    autoTab.onclick = () => {
      if (this.store.scheduledBet) return;
      this.store.setAutoBet(true);
    };

    const minus = card.querySelector(".bc-minus")!;
    const plus = card.querySelector(".bc-plus")!;
    const quickBtns = card.querySelectorAll(".bc-q");

    minus.addEventListener("click", () => {
      this.store.setBetAmount(
        Math.max(1, this.store.betAmount - 1)
      );
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

    this.bg
      .clear()
      .roundRect(0, 0, panelWidth, panelHeight, 20)
      .fill(0x1a1a1a);
  }
}