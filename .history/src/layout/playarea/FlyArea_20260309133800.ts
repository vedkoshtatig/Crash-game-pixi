import { Graphics, Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;

  private multiplier = 1;
  private multiplierText!: Text;

  private startX = 100;
  private startY = 400;

  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());

    this.initEvents();
  }

  init() {
    this.bg = Sprite.from("/bg.png");

    this.plane = new Sprite(this.idleTexture);
    this.plane.anchor.set(0.5);

    this.multiplierText = new Text({
      text: "1.00x",
      style: {
        fill: "#ffffff",
        fontSize: 48,
        fontWeight: "bold",
      },
    });

    this.addChild(this.bg, this.plane, this.multiplierText);
  }

  layout() {
    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const flyAreaHeight = height / 1.6;

    this.bg.width = width - sidebarWidth;
    this.bg.height = flyAreaHeight;

    this.multiplierText.position.set(450, 200);

    this.plane.width = 100;
    this.plane.height = 100;
    this.plane.scale.set(0.25);

    this.plane.position.set(this.startX, this.startY);
  }

  initEvents() {

    gameEvents.on("round:start", () => {
      console.log(object);
      this.resetPlane();
    });

    gameEvents.on("plane:update", (data) => {
      this.updatePlane(data.time);
    });

    gameEvents.on("plane:crash", (data) => {
      this.crashPlane(data.crashRate);
    });

  }

  updatePlane(time: number) {

    this.plane.texture = this.runTexture;

    this.multiplier = Math.exp(time * 0.3);
    this.multiplierText.text = this.multiplier.toFixed(2) + "x";

    const x = this.startX + time * 520;
    const y = this.startY - Math.pow(time, 2) * 120 - 20;

    this.plane.position.set(x, y);

    if (this.plane.rotation > -0.5) {
      this.plane.rotation -= 0.002;
    }

  }

  crashPlane(rate: number) {

    this.multiplierText.text = `Crashed @ ${rate}x`;

    this.plane.rotation = 2;

    console.log("CRASH", rate);
  }

  resetPlane() {

    this.multiplier = 1;
    this.multiplierText.text = "1.00x";

    this.plane.texture = this.idleTexture;
    this.plane.rotation = 0;

    this.plane.position.set(this.startX, this.startY);

  }
}