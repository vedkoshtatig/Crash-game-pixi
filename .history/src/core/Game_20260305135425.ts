import { Application, Container, Ticker } from "pixi.js";

export class Game {
  // Pixi Application
  static app: Application;

  // Root container for everything
  static stage: Container;

  /**
   * Initialize the game
   */
  static init(app: Application) {
    Game.app = app;

    // Create root container
    Game.stage = new Container();

    Game.app.stage.addChild(Game.stage);
  }

  /**
   * Start the game
   */
  static start() {
    console.log("Game Started");

    // Game loop example
    Game.app.ticker.add(Game.update);
  }

  /**
   * Main game loop
   */
  static update(ticker: Ticker) {
    const delta = ticker.deltaTime;
  }
}
