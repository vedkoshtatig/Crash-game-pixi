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

    this.logo = new Text({
      text: "Aviator",
    });

    this.amount = new Text({
      text: "30000",
    });

    this.currency = new Text({
      text: "USD",
    });

    this.balance = new Container();
    this.balance.addChild(this.amount, this.currency);

    this.addChild(this.rect, this.logo, this.balance);
  }

  resize(width: number, height: number) {

    // background
    this.rect.clear()
      .rect(0, 0, width, height)
      .fill(0x00ff00);

    // left logo
    this.logo.position.set(10, height / 2 - this.logo.height / 2);

    // place currency beside amount
    this.currency.position.set(this.amount.width + 6, 0);

    // vertically center balance container
    this.balance.position.set(
      width - this.balance.width - 10,
      height / 2 - this.balance.height / 2
    );
  }
}