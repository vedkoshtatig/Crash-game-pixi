import { Graphics, Container, Text} from "pixi.js";

import { gameEvents } from "../controller/GameController";
import { app } from "../main";

export class SideBar extends Container {

  private bg!: Graphics;
private resultCard!: Graphics;
private resultTitle!: Text;
private resultValue!: Text;

private listContainer!: Container;

private history: number[] = [];
  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
  this.bg = new Graphics();
  this.addChild(this.bg);

  this.resultCard = new Graphics();
  this.addChild(this.resultCard);

  this.resultTitle = new Text({
    text: "Round Result",
    style: {
      fill: "#8b97a6",
      fontSize: 18,
      fontWeight: "bold"
    }
  });

  this.resultValue = new Text({
    text: "1.00x",
    style: {
      fill: "#3fa9ff",
      fontSize: 42,
      fontWeight: "bold"
    }
  });

  this.addChild(this.resultTitle);
  this.addChild(this.resultValue);

  this.listContainer = new Container();
  this.addChild(this.listContainer);

  this.initEvents();
}

  layout() {

    const { width, height } = app.screen;

    const headerHeight = height /16;
    const sidebarWidth = width / 3.7;

    this.bg.clear()
     .roundRect(
  0,
  0,
  sidebarWidth,
  height - headerHeight,
  20
)
      .fill(0xff0000);

  }
}