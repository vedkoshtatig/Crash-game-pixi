import { Application, Container } from "pixi.js";

export class Game {

  static app: Application;
  static root: Container;

  static init(app: Application) {

    Game.app = app;

    // Root container for everything
    Game.root = new Container();

    Game.app.stage.addChild(Game.root);

  }

  static start() {

    console.log("Game Started");

    // Game loop
    Game.app.ticker.add(Game.update);

  }

  static update(delta: number) {

    // Game logic here

  }

}