import { Container, Sprite, Text, Texture, Assets } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { CrashGameStore } from "../../store/GameStore";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export class FlyArea extends Container {

  public jet!: Spine;

  private flightPhase: "RUNNING" | "TAKEOFF" | "FLYING" = "RUNNING";

  private bg!: Sprite;
  private crashHistory: number[] = [];

  private clouds: Sprite[] = [];
  private cloudTexture = Texture.from("/Clouds_01.png");

  private multiplierText!: Text;
  private timerText!: Text;
  private placeBetText!: Text;

  private world!: Container;

  private isFlying = false;
  private isCrashed = false;
  private isWaiting = false;

  private serverTime = 0;
  private lastUpdate = 0;

  private cloudsActive = false;
  private zoomTriggered = false;

  private flyWidth = 1920;
  private flyHeight = 1080;

  private startX = 0;
  private startY = 0;

  constructor() {
    super();
    this.init();
    this.initEvents();
    this.createClouds();
    app.ticker.add(this.update, this);
  }

  init() {

    this.jet = Spine.from({
      skeleton: "jetSpine",
      scale: 0.12
    });

    this.jet.state.setAnimation(0, "Idle", true);

    this.bg = Sprite.from("/bg.png");

    this.multiplierText = new Text({
      text: "1.00x",
      style: { fill: "#ffd54a", fontSize: 96, fontWeight: "900" }
    });

    this.timerText = new Text({
      text: "0",
      style: { fill: "#ffffff", fontSize: 60, fontWeight: "bold" }
    });

    this.placeBetText = new Text({
      text: "Place Your Bets!",
      style: { fill: "#000000", fontSize: 40, fontWeight: "bold" }
    });

    this.timerText.visible = false;
    this.placeBetText.visible = false;

    this.world = new Container();
    this.addChild(this.world);

    this.world.addChild(
      this.bg,
      this.jet,
      this.multiplierText,
      this.timerText,
      this.placeBetText
    );

    this.layout();
  }

  layout() {

    this.startX = this.flyWidth * 0.1;
    this.startY = this.flyHeight * 0.84;

    if (!this.isFlying && !this.isCrashed) {
      this.jet.position.set(this.startX, this.startY);
    }

    const centerX = this.flyWidth / 2;
    const centerY = this.flyHeight / 2;

    this.multiplierText.anchor.set(0.5);
    this.multiplierText.position.set(centerX, centerY);

    this.timerText.anchor.set(0.5);
    this.timerText.position.set(centerX, centerY - 120);

    this.placeBetText.anchor.set(0.5);
    this.placeBetText.position.set(centerX, centerY);
  }

  update() {

    if (!this.isFlying) return;

    const now = performance.now();
    const dt = (now - this.lastUpdate) / 1000;

    this.serverTime += dt;
    this.flyPlane(this.serverTime);

    this.lastUpdate = now;

    if (this.cloudsActive) this.updateClouds();
  }

  flyPlane(time: number) {

    const multiplier = CrashGameStore.instance.multiplier;
    this.multiplierText.visible = true;
    this.multiplierText.text = multiplier.toFixed(2) + "x";

    const runwayTime = 0.4;

    const maxX = this.flyWidth - 350;
    const x = Math.min(this.startX + time * 900, maxX);

    let y;

    if (time < runwayTime) {
      y = this.startY;

      if (this.flightPhase !== "RUNNING") {
        this.flightPhase = "RUNNING";
        this.jet.state.setAnimation(0, "Run", true);
      }

    } else {

      if (this.flightPhase === "RUNNING") {
        this.flightPhase = "TAKEOFF";

        this.jet.state.setAnimation(0, "TakeOff", false);
        this.jet.state.addAnimation(0, "Fly", true, 0);
      }

      const flyTime = time - runwayTime;
      const climbY = this.startY - Math.pow(flyTime, 2) * 350;

      y = Math.max(climbY, 420);
    }

    this.jet.position.set(x, y);

    const targetRotation = Math.min(time * 0.35, 0.45);
    this.jet.rotation = -targetRotation;

    if (!this.cloudsActive && x > this.flyWidth * 0.65) {
      this.cloudsActive = true;
      this.clouds.forEach(c => {
        c.visible = true;
        gsap.fromTo(c, { alpha: 0 }, { alpha: 1, duration: 1 });
      });
    }
  }

  crashPlane(rate: number) {

    this.isFlying = false;
    this.isCrashed = true;

    this.jet.state.setAnimation(0, "Blast", false);

    gsap.to(this.jet, {
      rotation: 2,
      duration: 1.2
    });

    this.multiplierText.text = `Crashed @ ${rate.toFixed(2)}x`;
    this.multiplierText.style.fill = 0xff0000;

    this.crashHistory.unshift(rate);
    gameEvents.emit("history:update", this.crashHistory);
  }

  resetPlane() {

    this.jet.state.setAnimation(0, "Idle", true);
    this.jet.rotation = 0;

    const startLeft = -120;
    this.jet.position.set(startLeft, this.startY);

    gsap.to(this.jet, {
      x: this.startX,
      duration: 1,
      ease: "power2.out"
    });
  }

  initEvents() {

    gameEvents.on("round:waiting", (data: { seconds: number }) => {

      this.isFlying = false;
      this.isCrashed = false;
      this.isWaiting = true;

      this.serverTime = 0;
      this.lastUpdate = 0;

      this.resetPlane();
      this.jet.state.setAnimation(0, "Idle", true);
    });

    gameEvents.on("round:start", () => {

      this.isWaiting = false;
      this.isFlying = true;
      this.flightPhase = "RUNNING";
    });

    gameEvents.on("plane:crash", (data: { crashRate: number }) => {
      this.crashPlane(data.crashRate);
    });
  }

  createClouds() {

    for (let i = 0; i < 18; i++) {
      const c = new Sprite(this.cloudTexture);
      c.anchor.set(0.5);
      c.scale.set(0.3 + Math.random() * 0.4);
      c.visible = false;
      this.clouds.push(c);
      this.world.addChildAt(c, 1);
    }
  }

  updateClouds() {

    for (let c of this.clouds) {
      const speed = 3 + CrashGameStore.instance.multiplier * 2;
      c.x -= speed * c.scale.x;
      c.y += speed * c.scale.x;

      if (c.x < -200 || c.y > this.flyHeight + 200) {
        c.x = this.flyWidth + 200;
        c.y = Math.random() * this.flyHeight * 0.5;
      }
    }
  }
}