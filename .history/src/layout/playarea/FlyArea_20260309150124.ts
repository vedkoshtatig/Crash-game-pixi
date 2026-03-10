import { Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;

  private multiplier = 1;
  private multiplierText!: Text;

  private flyWidth = 0;
  private flyHeight = 0;

  private startX = 100;
  private startY = 400;

  private isFlying = false;

  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");
  private blastTexture = Texture.from("/plane-blast.png");

  constructor() {
    super();

    this.init();
    this.layout();
    this.initEvents();

    window.addEventListener("resize", () => this.layout());
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

    this.flyWidth = width - sidebarWidth;
    this.flyHeight = flyAreaHeight;

    this.bg.width = this.flyWidth;
    this.bg.height = this.flyHeight;

    this.multiplierText.position.set(this.flyWidth / 2, 120);

    this.plane.scale.set(0.2);

    if (!this.isFlying) {
      this.plane.position.set(this.startX, this.startY);
    }
  }

  initEvents() {
    // WAITING STATE
    gameEvents.on("round:waiting", () => {
      console.log("Waiting for next round");

      this.isFlying = false;
      this.resetPlane();
    });

    // ROUND START
    gameEvents.on("round:start", () => {
      console.log("Plane taking off");

      this.isFlying = true;
    });

    // SERVER UPDATES PLANE TIME
    gameEvents.on("plane:update", (data: { time: number }) => {
      this.flyPlane(data.time);
    });
    // CRASH EVENT
    gameEvents.on("plane:crash", (data: { crashRate: number }) => {
      this.isFlying = false;

      this.crashPlane(data.crashRate);
    });
  }

  flyPlane(time: number) {
    this.plane.texture = this.runTexture;

    this.multiplier = Math.exp(time * 0.3);
    this.multiplierText.text = this.multiplier.toFixed(2) + "x";

    const maxX = this.flyWidth - 80;
    const maxY = 80;

    // smooth curve parameter
    const t = time * 0.8;

    const x = Math.min(this.startX + t * 300, maxX);
    const y = Math.max(this.startY - Math.pow(t, 1.7) * 180, maxY);

    this.plane.position.set(x, y);

    // smooth tilt based on movement
    const targetRotation = -0.45 * Math.min(time / 4, 1);
    this.plane.rotation += (targetRotation - this.plane.rotation) * 0.1;
  }

  crashPlane(rate: number) {
    this.plane.texture = this.blastTexture;

    this.multiplierText.text = `Crashed @ ${rate.toFixed(2)}x`;

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
