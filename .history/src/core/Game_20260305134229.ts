import { Application, Container, Ticker } from "pixi.js";

export class Game {

  static app: Application;
  static root: Container;

  static init(app: Application) {

    Game.app = app;

    Game.root = new Container();
    Game.app.stage.addChild(Game.root);

  }

  static start() {

    console.log("Game Started");

    Game.app.ticker.add(Game.update);

  }

  static update(ticker: Ticker) {

    const delta = ticker.deltaTime;

    // Game logic here
    // example:
    // sprite.x += 5 * delta;

  }

}