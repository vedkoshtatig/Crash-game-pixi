import { Graphics, Container, Text } from "pixi.js";
import { app } from "../main";
import { gameEvents } from "../controller/GameController";

export class SideBar extends Container {

  private bg!: Graphics;
  private tabsBg!: Graphics;
  private selectedTab!: Graphics;
  private roundCard!: Graphics;
  private footer!: Graphics;

  private titleMyBets!: Text;
  private roundTitle!: Text;
  private roundValue!: Text;

  private sidebarWidth: number = 0;
  private panelHeight: number = 0;

  constructor() {
    super();

    this.init();
    this.layout();
    this.initEvents();

    window.addEventListener("resize", () => this.layout());
  }

  init() {

    // ⭐ main panel bg
    this.bg = new Graphics();
    this.addChild(this.bg);

    // ⭐ top capsule
    this.tabsBg = new Graphics();
    this.selectedTab = new Graphics();

    // ⭐ round result card
    this.roundCard = new Graphics();

    // ⭐ footer strip
    this.footer = new Graphics();

    this.addChild(
      this.tabsBg,
      this.selectedTab,
      this.roundCard,
      this.footer
    );

    this.titleMyBets = new Text({
      text: "Leaderboard",
      style: {
        fill: "#ffffff",
        fontSize: 17,
        fontWeight: "bold"
      }
    });

    this.roundTitle = new Text({
      text: "Round Result",
      style: {
        fill: "#8b97a6",
        fontSize: 18
      }
    });

    this.roundValue = new Text({
      text: "1.00x",
      style: {
        fill: "#3fa9ff",
        fontSize: 52,
        fontWeight: "bold"
      }
    });

    this.addChild(
      this.titleMyBets,
      this.roundTitle,
      this.roundValue
    );
  }

  initEvents() {
    gameEvents.on("history:update", (history: number[]) => {

      if (!history.length) return;

      const last = history[0];
      this.roundValue.text = last.toFixed(2) + "x";

      if (last >= 10) this.roundValue.style.fill = "#ff9f43";
      else if (last >= 2) this.roundValue.style.fill = "#00ff88";
      else this.roundValue.style.fill = "#3fa9ff";
    });
  }

  layout() {

    const { width, height } = app.screen;

    this.sidebarWidth = width / 3.7;
    const headerHeight = height / 16;
    this.panelHeight = height - headerHeight;

    // ⭐ main dark panel
    this.bg.clear()
      .roundRect(0, 0, this.sidebarWidth, this.panelHeight, 22)
      .fill(0x0b0f14);

    // ⭐ outer pill
    this.tabsBg.clear()
      .roundRect(15, 15, this.sidebarWidth - 30, 52, 40)
      .fill(0x121821);

    // ⭐ active capsule
    this.selectedTab.clear()
      .roundRect(
        this.sidebarWidth / 2 - 95,
        21,
        190,
        40,
        26
      )
      .fill(0x2b3038);

    // ⭐ centered text
    this.titleMyBets.x =
      this.sidebarWidth / 2 - this.titleMyBets.width / 2;
    this.titleMyBets.y = this.panelHeight/21;

    // ⭐ result card
    this.roundCard.clear()
      .roundRect(15, 85, this.sidebarWidth - 30, 130, 24)
      .fill(0x121821);

    this.roundTitle.x =
      this.sidebarWidth / 2 - this.roundTitle.width / 2;
    this.roundTitle.y = this.panelHeight;

    this.roundValue.x =
      this.sidebarWidth / 2 - this.roundValue.width / 2;
    this.roundValue.y = this.panelHeight/5;

    // ⭐ footer strip
    this.footer.clear()
      .roundRect(
        15,
        this.panelHeight - 40,
        this.sidebarWidth - 30,
        28,
        12
      )
      .fill(0x121821);
  }
}