import { Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;

  private countdownInterval?: any;
private serverTime = 0;
private lastUpdate = 0;
  private multiplier = 1;
  private multiplierText!: Text;
  private timerText!: Text;

  private flyWidth = 0;
  private flyHeight = 0;

private startX = 0;
private startY = 0;

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
    app.ticker.add(this.update, this);
  }

  init() {
    this.bg = Sprite.from("/bg.png");

    this.timerText = new Text({
      text: "0",
      style: {
        fill: "#ffffff",
        fontSize: 40,
        fontWeight: "bold",
      },
    });

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

    this.addChild(this.bg, this.plane, this.multiplierText, this.timerText);
  }
update(delta: number) {

  if (!this.isFlying) return;

  const now = performance.now();
  const dt = (now - this.lastUpdate) / 1000;

  this.serverTime += dt;

  this.flyPlane(this.serverTime, this.multiplier);

  this.lastUpdate = now;
}
  layout() {
    const { width, height } = app.screen;


   this.flyWidth = width;
this.flyHeight = height;
    this.bg.position.set(width/2+40,height/2+90)
    this.bg.width = this.flyWidth;
    this.bg.height = this.flyHeight;
    this.bg.anchor.set(0.5)
    this.bg.scale.set(1.2)
  this.startX = this.flyWidth * 0.1;
  this.startY = this.flyHeight * 0.86;

    this.multiplierText.position.set(this.flyWidth / 2, 120);

    this.plane.scale.set(0.2);

    if (!this.isFlying) {
      this.plane.position.set(this.startX, this.startY);
    }
  }

  initEvents() {
    // WAITING STATE
    gameEvents.on("round:waiting", (data: { seconds: number }) => {
      console.log("Waiting for next round");

      this.isFlying = false;
      this.resetPlane();
      this.waitTimer(data.seconds);
    });

    // ROUND START
    gameEvents.on("round:start", () => {
      console.log("Plane taking off");
      this.isFlying = true;
    });

    // SERVER UPDATES
   gameEvents.on("plane:update", (data: { time: number; multiplier: number }) => {

  this.serverTime = data.time;
  this.multiplier = data.multiplier;
  this.lastUpdate = performance.now();

});

    // CRASH EVENT
    gameEvents.on("plane:crash", (data: { crashRate: number }) => {
      this.isFlying = false;
      this.crashPlane(data.crashRate);
    });
  }

flyPlane(time: number, multiplier: number) {

  this.plane.texture = this.runTexture;

  this.multiplierText.text = multiplier.toFixed(2) + "x";

  const maxX = this.flyWidth - 80;
  const maxY = 80;

  const x = Math.min(this.startX + time * 380, maxX);
  const y = Math.max(this.startY - Math.pow(time, 2) * 60, maxY);

  this.plane.position.set(x, y);

  if (this.plane.rotation > -0.45) {
    this.plane.rotation -= 0.003;
  }
}

  waitTimer(seconds: number) {
    // clear old timer
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.timerText.visible = true;
    this.timerText.position.set(this.flyWidth / 2, 200);

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