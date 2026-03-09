import { Container, Graphics, Text } from "pixi.js";
import { app } from "../../main";

export class PlayArea extends Container {

  private bg!: Graphics;
  private graph!: Graphics;
  private plane!: Graphics;
  private multiplier!: Text;

  private time = 0;

  constructor() {
    super();

    this.init();
    this.layout();

    app.ticker.add(this.update, this);
    window.addEventListener("resize", () => this.layout());
  }

  init() {

    // background
    this.bg = new Graphics();
    this.addChild(this.bg);

    // graph
    this.graph = new Graphics();
    this.addChild(this.graph);

    // aviator plane (temporary triangle)
    this.plane = new Graphics();
    this.plane.beginFill(0xff0000);
    this.plane.drawPolygon([0,0, 20,10, 0,20]);
    this.plane.endFill();

    this.addChild(this.plane);

    // multiplier text
    this.multiplier = new Text({
      text: "1.00x",
      style: {
        fill: "#ffffff",
        fontSize: 40,
        fontWeight: "bold"
      }
    });

    this.addChild(this.multiplier);
  }

  layout() {

    const w = app.screen.width;
    const h = app.screen.height;

    this.bg.clear();
    this.bg.beginFill(0x0b0f1a);
    this.bg.drawRect(0, 0, w, h);
    this.bg.endFill();

    this.multiplier.x = w / 2;
    this.multiplier.y = 40;
    this.multiplier.anchor.set(0.5);
  }

 

}