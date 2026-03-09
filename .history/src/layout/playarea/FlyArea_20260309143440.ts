import { Graphics, Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { TilingSprite } from "pixi.js";
// import { gameEvents } from "../../controller/GameController";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;

  private multiplier = 1;
  private multiplierText!: Text;
  private flyWidth = 0;
  private flyHeight = 0;
  private startX = 100;
  private startY = 400;
  private time = 0;
  private isFlying = false;
  private bgOffsetX = 0;
  private followX = 450;
  private crashAt = 3; // crash after 3 seconds
  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");
  private blastTexture = Texture.from("/plane-blast.png");

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
    app.ticker.add((ticker) => this.update(ticker.deltaTime));
    this.startRound();
    this.initEvents();
  }

  init() {
  

this.bg = new TilingSprite({
  texture: Texture.from("/bg.png"),
  width: this.flyWidth,
  height: this.flyHeight
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

    this.addChild(this.bg, this.plane, this.multiplierText);
  }
  update(delta: number) {
    if (!this.isFlying) return;

    this.time += delta / 60;

    this.flyPlane(this.time);

    // if (this.time >= this.crashAt) {
    //   this.isFlying = false;
    //   this.crashPlane(this.multiplier);

    //   setTimeout(() => {
    //     this.resetPlane();
    //     this.startRound();
    //   }, 2000);
    // }
  }
  startRound() {
    this.time = 0;
    this.isFlying = true;

    this.resetPlane();
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
    // gameEvents.on("round:waiting", () => {
    //   console.log("Place your bets");
    //   // this.resetPlane();
    // });
    // gameEvents.on("round:start", () => {
    //   console.log("Cant place bets , plane runnings");
    //   // this.resetPlane();
    // });
    // gameEvents.on("plane:update", (data) => {
    //   console.log("Cant place bets , plane running");
    //   this.updatePlane(data.time);
    // });
    // gameEvents.on("plane:crash", (data) => {
    //   this.crashPlane(data.crashRate);
    // });
  }
  flyPlane(time: number) {

  this.plane.texture = this.runTexture;

  this.multiplier = Math.exp(time * 0.3);
  this.multiplierText.text = this.multiplier.toFixed(2) + "x";

  const maxY = 80;

  let x = this.startX + time * 380;
  let y = this.startY - Math.pow(time, 2) * 60;

  y = Math.max(y, maxY);

  // CAMERA FOLLOW
  if (x > this.followX) {

    const extra = x - this.followX;

    this.bgOffsetX -= extra;

    this.bg.x = this.bgOffsetX;

    x = this.followX;

  }

  this.plane.position.set(x, y);

  if (this.plane.rotation > -0.45) {
    this.plane.rotation -= 0.003;
  }

}

  // crashPlane(rate: number) {
  //   this.plane.texture = this.blastTexture;
  //   this.multiplierText.text = `Crashed @ ${3}x`;

  //   this.plane.rotation = 2;

  //   console.log("CRASH", rate);
  // }

  resetPlane() {

  this.multiplier = 1;
  this.multiplierText.text = "1.00x";

  this.plane.texture = this.idleTexture;
  this.plane.rotation = 0;

  this.bgOffsetX = 0;
  this.bg.x = 0;

  this.plane.position.set(this.startX, this.startY);

}
}
