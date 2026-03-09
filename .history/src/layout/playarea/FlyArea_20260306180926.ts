import { Graphics, Container, Sprite, Text } from "pixi.js";
import { app } from "../../main";

export class FlyArea extends Container {
  private bg!: Sprite;
  private plane!: Sprite;
  private trail!: Graphics;
  private multiplier = 1;
  private multiplierText!: Text;
  private isFlying = false;
  private t = 0;
  private speed = 0.003;
  private isHovering = false;
  private hoverTime = 0;
  private hoverX = 0;
  private hoverY = 0;
  private startX = 100;
  private startY = 400;
  private points: { x: number; y: number }[] = [];

  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.isFlying = true;
        this.t = 0;
        this.multiplier = 1;
        this.multiplierText.text = "1.00x";
       this.points = [];
this.points.push({ x: this.startX, y: this.startY });
this.trail.clear();
      }
    });

    app.ticker.add(this.update, this);
  }

  init() {
    this.bg = Sprite.from("/bg.png");
    this.plane = Sprite.from("/plane.png");
    this.plane.anchor.set(0.5);

    this.trail = new Graphics();
    this.multiplierText = new Text({
      text: "1.00x",
      style: {
        fill: "#ffffff",
        fontSize: 48,
        fontWeight: "bold",
      },
    });

    // this.multiplierText.anchor.set(0.5);
    // this.multiplierText.position.set(350, 100);
    this.addChild(this.bg, this.trail, this.plane, this.multiplierText);
  }

  layout() {
    const { width, height } = app.screen;

    const sidebarWidth = width / 3.6;
    const flyAreaHeight = height / 1.6;

    this.bg.width = width - sidebarWidth;
    this.bg.height = flyAreaHeight;
    this.multiplierText.position.set(450, 200);
    this.plane.width = 200;
    this.plane.height = 200;
    this.plane.scale.x = -0.3;

    this.plane.position.set(this.startX, this.startY);
  }

  update() {
    if (this.isFlying) {
      this.t += this.speed;
      this.multiplier = Math.exp(this.t * 0.3);
      this.multiplierText.text = this.multiplier.toFixed(2) + "x";
      const flyWidth = this.bg.width;

      const x = this.startX + this.t * 520;
      const y = this.startY - Math.pow(this.t, 2) * 120;

      this.plane.position.set(x, y);

      this.trail.lineTo(x, y).stroke({
        width: 4,
        color: 0xff3b3b,
        cap: "round",
        join: "round",
      });

      if (x > flyWidth - 50 || y < 40) {
        this.isFlying = false;
        this.isHovering = true;

        this.hoverX = this.plane.x;
        this.hoverY = this.plane.y;
      }
    }

    if (this.isHovering) {
      this.hoverTime += 0.03;
      this.t += this.speed;
      this.multiplier = Math.exp(this.t * 0.4);
      this.multiplierText.text = this.multiplier.toFixed(2) + "x";
      const amplitude = 8; // how much it moves up/down
      const speed = 1; // hover speed

      const yOffset = Math.sin(this.hoverTime * speed) * amplitude;
      this.plane.rotation = Math.sin(this.hoverTime) * 0.05;
      this.plane.x = this.hoverX;
      this.plane.y = this.hoverY + yOffset;
    }
    if (this.multiplier >= 4) {
      this.multiplierText.text = "Plane Crashed";
      this.removeChild(this.plane, this.trail);
    }
  }
}
