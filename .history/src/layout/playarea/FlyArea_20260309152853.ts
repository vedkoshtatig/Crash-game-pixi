import { Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";

export class FlyArea extends Container {

  private bg!: Sprite;
  private plane!: Sprite;

  private multiplierText!: Text;
  private timerText!: Text;

  private countdownInterval?: any;

  private serverTime = 0;
  private lastUpdate = 0;

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

    app.ticker.add(this.update.bind(this));
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

    this.timerText = new Text({
      text: "",
      style: {
        fill: "#ffffff",
        fontSize: 40,
        fontWeight: "bold",
      },
    });

    this.addChild(this.bg, this.plane, this.multiplierText, this.timerText);

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

    this.timerText.position.set(this.flyWidth / 2, 200);

    this.plane.scale.set(0.2);

    if (!this.isFlying) {
      this.plane.position.set(this.startX, this.startY);
    }

  }

  initEvents() {

    gameEvents.on("round:waiting", (data: { seconds: number }) => {

      this.isFlying = false;

      this.resetPlane();

      this.waitTimer(data.seconds);

    });

    gameEvents.on("round:start", () => {

      this.isFlying = true;

      this.timerText.visible = false;

    });

    gameEvents.on("plane:update", (data: { time: number }) => {

      this.serverTime = data.time;
      this.lastUpdate = performance.now();

    });

    gameEvents.on("plane:crash", (data: { crashRate: number }) => {

      this.isFlying = false;

      this.crashPlane(data.crashRate);

    });

  }

  update() {

    if (!this.isFlying) return;

    const now = performance.now();

    const deltaSeconds = (now - this.lastUpdate) / 1000;

    const predictedTime = this.serverTime + deltaSeconds;

    const multiplier = Math.exp(predictedTime * 0.06);

    this.multiplierText.text = multiplier.toFixed(2) + "x";

    this.flyPlane(predictedTime);

  }

  flyPlane(time: number) {

    this.plane.texture = this.runTexture;

    const maxX = this.flyWidth - 80;
    const maxY = 80;

    const t = time * 0.8;

    const x = Math.min(this.startX + t * 300, maxX);
    const y = Math.max(this.startY - Math.pow(t, 1.7) * 180, maxY);

    this.plane.position.set(x, y);

    const targetRotation = -0.45 * Math.min(time / 4, 1);

    this.plane.rotation += (targetRotation - this.plane.rotation) * 0.1;

  }

  waitTimer(seconds: number) {

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.timerText.visible = true;

    let remaining = seconds;

    this.timerText.text = remaining.toString();

    this.countdownInterval = setInterval(() => {

      remaining--;

      if (remaining <= 0) {

        clearInterval(this.countdownInterval);

        this.timerText.visible = false;

      } else {

        this.timerText.text = remaining.toString();

      }

    }, 1000);

  }

  crashPlane(rate: number) {

    this.plane.texture = this.blastTexture;

    this.multiplierText.text = `Crashed @ ${rate.toFixed(2)}x`;

    this.plane.rotation = 2;

  }

  resetPlane() {

    this.multiplierText.text = "1.00x";

    this.plane.texture = this.idleTexture;

    this.plane.rotation = 0;

    this.plane.position.set(this.startX, this.startY);

  }

}