import { Graphics, Text, Container, Application } from "pixi.js";
import { app } from "../main";
export class Header extends Container {
  private logo!: Text;
  private app!: Application;
  constructor() {
    super();
    this.build();
  }
  build() {
   const rect = new Graphics()
      .rect(0, 0, app.screen.width, 40)
      .fill(0xff000);

    const logo = new Text({
      text: "Aviator",
    
    });
    logo.position.set(10, 5);

    const balance = new Container();

    const amount = new Text({
      text: "30000",
   
    });

    const currency = new Text({
      text: "USD",
    
    });

    currency.position.x = amount.width + 6;

    balance.addChild(amount, currency);

    // place container on right
    balance.position.set(app.screen.width - balance.width - 10, 5);

    this.addChild(rect, logo, balance);
  }
}

