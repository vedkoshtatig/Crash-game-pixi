import { Container, Sprite, Text, Texture } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";

export class FlyArea extends Container {

  private bg!: Sprite;
  private plane!: Sprite;

  private crashHistory: number[] = [];

  private world!: Container;
  private viewportMask!: Sprite;

  private clouds: Sprite[] = [];
  private cloudTexture = Texture.from("/Clouds_01.png");

  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");
  private blastTexture = Texture.from("/plane-blast.png");

  private multiplierText!: Text;
  private timerText!: Text;

  private WORLD_WIDTH = 1920;
  private WORLD_HEIGHT = 1080;

  private flyWidth = 0;
  private flyHeight = 0;

  private startX = 0;
  private startY = 0;

  private bgScaleX = 0;
  private bgScaleY = 0;

  private cloudsActive = false;
  private zoomTriggered = false;

  private isFlying = false;
  private isWaiting = false;
  private isCrashed = false;

  private multiplier = 1;
  private serverTime = 0;
  private lastUpdate = 0;

  private countdownInterval?: any;

  constructor() {
    super();

    this.init();
    this.layout();
    this.initEvents();
    this.createClouds();

    this.resize(app.screen.width, app.screen.height);

    window.addEventListener("resize", () => {
      this.resize(app.screen.width, app.screen.height);
    });

    app.ticker.add(this.update, this);
  }

  init() {

    this.bg = Sprite.from("/bg.png");

    this.plane = new Sprite(this.idleTexture);
    this.plane.anchor.set(0.5);

    this.multiplierText = new Text({
      text: "1.00x",
      style: {
        fill: "#ffd54a",
        fontSize: 96,
        fontWeight: "900",
      },
    });

    this.timerText = new Text({
      text: "0",
      style: {
        fill: "#ffffff",
        fontSize: 60,
        fontWeight: "bold",
      },
    });

    this.timerText.visible = false;

    this.world = new Container();
    this.addChild(this.world);

    this.world.addChild(
      this.bg,
      this.plane,
      this.multiplierText,
      this.timerText
    );
  }

  resize(w: number, h: number) {

    const scale = Math.min(
      w / this.WORLD_WIDTH,
      h / this.WORLD_HEIGHT
    );

    this.world.scale.set(scale);

    this.world.x = (w - this.WORLD_WIDTH * scale) / 2;
    this.world.y = (h - this.WORLD_HEIGHT * scale) / 2;

    if (!this.viewportMask) {
      this.viewportMask = Sprite.from(Texture.WHITE);
      this.addChild(this.viewportMask);
      this.mask = this.viewportMask;
    }

    this.viewportMask.width = w;
    this.viewportMask.height = h;

    this.layout();
  }

  layout() {

    this.flyWidth = this.WORLD_WIDTH;
    this.flyHeight = this.WORLD_HEIGHT;

    const CAM_OFFSET_X = 40;
    const CAM_OFFSET_Y = -80;

    this.bgScaleX = 1.9;
    this.bgScaleY = 1.65;

    this.bg.anchor.set(0.5);
    this.bg.position.set(
      this.flyWidth / 2 + CAM_OFFSET_X,
      this.flyHeight / 2 + CAM_OFFSET_Y
    );

    this.bg.width = this.flyWidth;
    this.bg.height = this.flyHeight;
    this.bg.scale.set(this.bgScaleX, this.bgScaleY);

    this.startX = this.flyWidth * 0.1;
    this.startY = this.flyHeight * 0.86;

    const centerX = this.WORLD_WIDTH / 2;
    const centerY = this.WORLD_HEIGHT / 2;

    this.multiplierText.anchor.set(0.5);
    this.multiplierText.position.set(centerX + 150, centerY);

    this.timerText.anchor.set(0.5);
    this.timerText.position.set(centerX + 150, centerY);

    this.plane.scale.set(0.5);

    if (!this.isFlying && !this.isCrashed) {
      this.plane.position.set(this.startX, this.startY);
    }
  }

  private getCameraBounds() {
    return {
      left: 0,
      right: this.WORLD_WIDTH,
      top: 0,
      bottom: this.WORLD_HEIGHT,
    };
  }

  createClouds() {

    for (let i = 0; i < 18; i++) {

      const cloud = new Sprite(this.cloudTexture);
      cloud.anchor.set(0.5);

      const scale = 0.3 + Math.random() * 0.4;
      cloud.scale.set(scale);

      cloud.visible = false;
      cloud.alpha = 0;

      const cam = this.getCameraBounds();

      cloud.x = cam.left + Math.random() * this.flyWidth;
      cloud.y = -200;

      (cloud as any).baseSpeed = 3;

      this.clouds.push(cloud);
      this.world.addChildAt(cloud, 1);
    }
  }

  updateClouds() {

    for (let cloud of this.clouds) {

      let speed = (cloud as any).baseSpeed + this.multiplier * 1.9;
      speed = Math.min(speed, 12);

      const depth = cloud.scale.x;

      cloud.x -= speed * depth;
      cloud.y += speed * depth;

      if (cloud.x < -300 || cloud.y > this.flyHeight + 300) {
        cloud.x = Math.random() * this.flyWidth;
        cloud.y = -200;
      }
    }
  }

  update() {

    if (this.cloudsActive) this.updateClouds();
    if (!this.isFlying) return;

    const now = performance.now();
    const dt = (now - this.lastUpdate) / 1000;

    this.serverTime += dt;

    this.flyPlane(this.serverTime, this.multiplier);

    this.lastUpdate = now;
  }

  flyPlane(time: number, multiplier: number) {

    this.multiplierText.visible = true;

    this.plane.texture = this.runTexture;
    this.multiplierText.text = multiplier.toFixed(2) + "x";

    const maxX = this.flyWidth - 150;
    const runwayTime = 0.4;

    const x = Math.min(this.startX + time * 900, maxX);

    if (!this.zoomTriggered && x >= this.flyWidth * 0.25) {
      this.zoomTriggered = true;

      gsap.to(this.bg.scale, {
        x: 2.4,
        y: 2.4,
        duration: 2,
      });

      gsap.to(this.bg, {
        x: this.flyWidth / 2 - 80,
        y: this.flyHeight / 2 + 150,
        duration: 2.5,
      });
    }

    if (!this.cloudsActive && x >= this.flyWidth * 0.65) {

      this.cloudsActive = true;

      this.clouds.forEach(c => {
        c.visible = true;
        gsap.to(c, { alpha: 1, duration: 0.8 });
      });
    }

    let y;

    if (time < runwayTime) {
      y = this.startY;
    } else {

      const flyTime = time - runwayTime;
      const climb = this.startY - Math.pow(flyTime, 2) * 350;

      if (climb > 290) y = climb;
      else {
        const t = performance.now() * 0.004;
        y = 290 + Math.sin(t) * 6;
      }
    }

    this.plane.position.set(x, y);

    if (time > runwayTime) {
      const flyTime = time - runwayTime;
      const rot = Math.min(flyTime * 0.4, 0.45);
      this.plane.rotation = -rot;
    }
  }

  waitTimer(seconds: number) {

    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.multiplierText.visible = false;
    this.timerText.visible = true;

    let remaining = seconds;
    this.timerText.text = remaining.toString();

    const pulse = () => {

      gsap.fromTo(
        this.timerText.scale,
        { x: 0.6, y: 0.6 },
        { x: 1.4, y: 1.4, duration: 0.45, yoyo: true, repeat: 1 }
      );
    };

    pulse();

    this.countdownInterval = setInterval(() => {

      remaining--;

      if (remaining <= 0) {

        clearInterval(this.countdownInterval);

        gsap.to(this.timerText, {
          scale: 2,
          alpha: 0,
          duration: 0.5,
          onComplete: () => {
            this.timerText.visible = false;
            this.timerText.scale.set(1);
            this.timerText.alpha = 1;
          }
        });

      } else {
        this.timerText.text = remaining.toString();
        pulse();
      }

    }, 1000);
  }

  crashPlane(rate: number) {

    this.isCrashed = true;
    this.cloudsActive = false;

    this.multiplierText.style.fill = 0xff0000;

    this.plane.texture = this.blastTexture;
    this.plane.rotation = 2;

    this.multiplierText.text = `Crashed @ ${rate.toFixed(2)}x`;

    this.crashHistory.unshift(rate);
    if (this.crashHistory.length > 20) this.crashHistory.pop();

    gameEvents.emit("history:update", this.crashHistory);
  }

  resetScene() {

    this.cloudsActive = false;
    this.zoomTriggered = false;

    this.multiplierText.style.fill = "#ffd54a";

    this.bg.position.set(
      this.flyWidth / 2 + 40,
      this.flyHeight / 2 - 80
    );

    this.bg.scale.set(this.bgScaleX, this.bgScaleY);

    this.clouds.forEach(c => {
      gsap.to(c, {
        alpha: 0,
        duration: 0.3,
        onComplete: () => c.visible = false
      });
    });
  }

  resetPlane() {

    this.multiplier = 1;
    this.multiplierText.text = "1.00x";

    this.plane.texture = this.idleTexture;
    this.plane.rotation = 0;

    const startLeft = -120;
    this.plane.position.set(startLeft, this.startY);

    gsap.to(this.plane, {
      x: this.startX,
      duration: 1,
    });
  }

  initEvents() {

    gameEvents.on("round:waiting", (d: { seconds: number }) => {

      if (this.isWaiting) return;

      this.isWaiting = true;
      this.isFlying = false;
      this.isCrashed = false;

      this.serverTime = 0;
      this.lastUpdate = 0;

      this.resetScene();
      this.resetPlane();
      this.waitTimer(d.seconds);
    });

    gameEvents.on("round:start", () => {
      this.isWaiting = false;
      this.isFlying = true;
    });

    gameEvents.on("plane:update", (d: any) => {
      this.serverTime = d.time;
      this.multiplier = d.multiplier;
      this.lastUpdate = performance.now();
    });

    gameEvents.on("plane:crash", (d: any) => {
      this.isFlying = false;
      this.crashPlane(d.crashRate);
    });
  }
}