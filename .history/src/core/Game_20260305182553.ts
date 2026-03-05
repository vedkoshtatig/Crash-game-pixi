import { Application } from "pixi.js";
import { MainScreen } from "../screens/MainScreen";
import { LayoutManager } from "../managers/LayoutManager";

export class Game {

  private app: Application;
  private mainScreen: MainScreen;

  constructor(app: Application) {

    this.app = app;

    this.mainScreen = new MainScreen();

    this.app.stage.addChild(this.mainScreen);

    LayoutManager.layout(this.mainScreen);

    window.addEventListener("resize", () => {
      LayoutManager.layout(this.mainScreen);
    });

  }

}