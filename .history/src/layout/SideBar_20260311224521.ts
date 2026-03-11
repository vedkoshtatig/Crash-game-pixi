import { Graphics, Container, Text } from "pixi.js";
import { app } from "../main";
import { gameEvents } from "../controller/GameController";

export class SideBar extends Container {

  private bg!: Graphics;
  private tabsBg!: Graphics;
  private selectedTab!: Graphics;
  private roundCard!: Graphics;
  private headerRow!: Graphics;
  private footer!: Graphics;

private titleMyBets!: Text;

  private roundTitle!: Text;
  private roundValue!: Text;

  private colPlayer!: Text;
  private colBet!: Text;
  private colX!: Text;
  private colWin!: Text;

  private listContainer!: Container;

  private sidebarWidth: number = 0;

  constructor() {
    super();

    this.init();
    this.layout();
    this.initEvents();

    window.addEventListener("resize", () => this.layout());
  }

  init() {

    // ⭐ BACKGROUND FIRST (important)
    this.bg = new Graphics();
    this.addChild(this.bg);

    this.tabsBg = new Graphics();
    this.selectedTab = new Graphics();
    this.roundCard = new Graphics();
    this.headerRow = new Graphics();
    this.footer = new Graphics();

    this.addChild(
      this.tabsBg,
      this.selectedTab,
      this.roundCard,
      this.headerRow,
      this.footer
    );

    // ⭐ TAB TEXTS
    this.titleAll = new Text({ text: "All Bets", style: { fill: "#7f8b99", fontSize: 16 } });
    this.titlePrev = new Text({ text: "Previous", style: { fill: "#ffffff", fontSize: 16, fontWeight: "bold" } });
    this.titleTop = new Text({ text: "Top", style: { fill: "#7f8b99", fontSize: 16 } });

    // ⭐ ROUND RESULT
    this.roundTitle = new Text({ text: "Round Result", style: { fill: "#8b97a6", fontSize: 18 } });
    this.roundValue = new Text({ text: "1.00x", style: { fill: "#3fa9ff", fontSize: 46, fontWeight: "bold" } });

    // ⭐ TABLE HEADER
    this.colPlayer = new Text({ text: "Player", style: { fill: "#6f7c8c", fontSize: 15 } });
    this.colBet = new Text({ text: "Bet USD", style: { fill: "#6f7c8c", fontSize: 15 } });
    this.colX = new Text({ text: "X", style: { fill: "#6f7c8c", fontSize: 15 } });
    this.colWin = new Text({ text: "Win USD", style: { fill: "#6f7c8c", fontSize: 15 } });

    this.addChild(
      this.titleAll,
      this.titlePrev,
      this.titleTop,
      this.roundTitle,
      this.roundValue,
      this.colPlayer,
      this.colBet,
      this.colX,
      this.colWin
    );

    this.listContainer = new Container();
    this.addChild(this.listContainer);
  }

  initEvents() {
    gameEvents.on("history:update", (history: number[]) => {

      if (!history.length) return;

      const last = history[0];
      this.roundValue.text = last.toFixed(2) + "x";

      if (last >= 10) this.roundValue.style.fill = "#ff9f43";
      else if (last >= 2) this.roundValue.style.fill = "#00ff88";
      else this.roundValue.style.fill = "#3fa9ff";

      this.renderRows();
    });
  }

  layout() {

    const { width, height } = app.screen;

    this.sidebarWidth = width / 3.7;
    const headerHeight = height / 16;
    const panelHeight = height - headerHeight;

    // ⭐ MAIN PANEL
    this.bg.clear()
      .roundRect(0, 0, this.sidebarWidth, panelHeight, 22)
      .fill(0x0b0f14);

    // ⭐ TABS
    this.tabsBg.clear()
      .roundRect(15, 15, this.sidebarWidth - 30, 46, 30)
      .fill(0x121821);

    this.selectedTab.clear()
      .roundRect(this.sidebarWidth / 2 - 70, 20, 140, 36, 20)
      .fill(0x2a2f36);

    this.titleAll.position.set(40, 28);
    this.titlePrev.position.set(this.sidebarWidth / 2 - 35, 28);
    this.titleTop.position.set(this.sidebarWidth - 90, 28);

    // ⭐ ROUND CARD
    this.roundCard.clear()
      .roundRect(15, 75, this.sidebarWidth - 30, 110, 20)
      .fill(0x121821);

    this.roundTitle.x = this.sidebarWidth / 2 - this.roundTitle.width / 2;
    this.roundTitle.y = 90;

    this.roundValue.x = this.sidebarWidth / 2 - this.roundValue.width / 2;
    this.roundValue.y = 115;

    // ⭐ TABLE HEADER
    this.headerRow.clear()
      .rect(15, 200, this.sidebarWidth - 30, 34)
      .fill(0x141a21);

    this.colPlayer.position.set(25, 207);
    this.colBet.position.set(this.sidebarWidth / 2 - 20, 207);
    this.colX.position.set(this.sidebarWidth - 120, 207);
    this.colWin.position.set(this.sidebarWidth - 70, 207);

    // ⭐ LIST START
    this.listContainer.position.set(15, 240);

    // ⭐ FOOTER
    this.footer.clear()
      .roundRect(15, panelHeight - 40, this.sidebarWidth - 30, 28, 12)
      .fill(0x121821);
  }

  renderRows() {

    this.listContainer.removeChildren();

    let y = 0;

    for (let i = 0; i < 14; i++) {

      const row = new Graphics()
        .roundRect(0, y, this.sidebarWidth - 30, 48, 22)
        .fill(0x0e1319);

      const name = new Text({
        text: "d***" + Math.floor(Math.random() * 9),
        style: { fill: "#c7d0db", fontSize: 16 }
      });

      const bet = new Text({
        text: "100.00",
        style: { fill: "#c7d0db", fontSize: 16 }
      });

      const win = new Text({
        text: "0.00",
        style: { fill: "#8b97a6", fontSize: 16 }
      });

      name.position.set(50, y + 14);
      bet.position.set(this.sidebarWidth / 2 - 10, y + 14);
      win.position.set(this.sidebarWidth - 70, y + 14);

      this.listContainer.addChild(row, name, bet, win);

      y += 54;
    }
  }
}