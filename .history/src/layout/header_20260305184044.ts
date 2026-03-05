import { Graphics, Text, Container } from "pixi.js";

export class Header extends Container {

  private rect: Graphics;
  private logo: Text;
  private balance: Container;
  private amount: Text;
  private currency: Text;

  constructor() {
    super();

    this.rect = new Graphics();

    this.logo = new Text({ text: "Aviator" });

    this.amount = new Text({ text: "30000" });

    this.currency = new Text({ text: "USD" });

    this.balance = new Container();
    this.balance.addChild(this.amount, this.currency);

    this.addChild(this.rect, this.logo, this.balance);
  }

  resize(width: number, height: number) {

    this.rect.clear()
      .rect(0, 0, width, height)
      .fill(0x00ff00);

    // logo
    this.logo.position.set(10, height / 2 - this.logo.height / 2);

    // amount
    this.amount.position.set(0, height / 2 - this.amount.height / 2);

    // currency beside amount
    this.currency.position.set(
      this.amount.x + this.amount.width + 6,
      height / 2 - this.currency.height / 2
    );

    // align balance container right
    this.balance.position.set(
      width - this.balance.width - 10,
      0
    );
  }
}