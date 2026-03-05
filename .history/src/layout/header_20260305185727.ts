import { Graphics, Text, Container } from "pixi.js";
import { app } from "../main";

export class Header extends Container {

  private bg!: Graphics;
  private logo!: Text;

  private balance!: Container;
  private amount!: Text;
  private currency!: Text;

  constructor() {
    super();

    this.init();
    this.layout();
console.log(Header.height);
    window.addEventListener("resize", () => this.layout());
  }

  init() {

    // background
    this.bg = new Graphics();

    // logo
    this.logo = new Text({
      text: "Aviator"
    });

    // balance container
    this.balance = new Container();

    this.amount = new Text({
      text: "30000"
    });

    this.currency = new Text({
      text: "USD"
    });

    this.balance.addChild(this.amount, this.currency);

    this.addChild(this.bg, this.logo, this.balance);
    console.log(Header.height);
  }

  layout() {

    const { width, height } = app.screen;

    const headerHeight = height / 18;

    // redraw bg
    this.bg.clear()
      .rect(0, 0, width, headerHeight)
      .fill(0xff000);

    // logo position
    this.logo.position.set(20, headerHeight / 2 - this.logo.height / 2);

    // layout balance text
    this.amount.position.set(0, 0);
    this.currency.position.set(this.amount.width + 6, 0);

    // right align balance container
    this.balance.position.set(
      width - this.balance.width - 20,
      headerHeight / 2 - this.balance.height / 2
    );
  }
}