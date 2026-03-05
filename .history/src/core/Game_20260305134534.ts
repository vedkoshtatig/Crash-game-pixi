import { Application, Container } from "pixi.js";

export class Game {

  static app: Application;
  static root: Container;

  static GAME_WIDTH = 1280;
  static GAME_HEIGHT = 720;

  static init(app: Application) {

    Game.app = app;

    Game.root = new Container();
    Game.app.stage.addChild(Game.root);

    window.addEventListener("resize", Game.resize);

    Game.resize();
  }

  static resize() {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = Math.min(
      screenWidth / Game.GAME_WIDTH,
      screenHeight / Game.GAME_HEIGHT
    );

    Game.root.scale.set(scale);

    Game.root.x = (screenWidth - Game.GAME_WIDTH * scale) / 2;
    Game.root.y = (screenHeight - Game.GAME_HEIGHT * scale) / 2;

  }

}