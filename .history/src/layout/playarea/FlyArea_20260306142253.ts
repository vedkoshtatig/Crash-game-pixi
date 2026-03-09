import { Graphics, Container, Text, Ticker } from "pixi.js";
import { app } from "../../main";
export class FlyArea extends Container {

  private bg!: Graphics;
  private graph!: Graphics;
  private plane!: Graphics;
  private multiplierText!: Text;

  private flyAreaWidth = 0;
  private flyAreaHeight = 0;

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

    // plane (temporary triangle)
    this.plane = new Graphics();
    this.plane.poly([0,0, 20,10, 0,20]).fill(0xff0000);
    this.addChild(this.plane);

    // multiplier text
    this.multiplierText = new Text({
      text: "1.00x",
      style: {
        fill: "#ffffff",
        fontSize: 40,
        fontWeight: "bold"
      }
    });

    this.multiplierText.anchor.set(0.5);
    this.addChild(this.multiplierText);
  }

  layout() {

    const { width, height } = app.screen;

    const sidebarWidth = width / 3.65;
    const flyAreaHeight = height / 1.6;

    this.flyAreaWidth = width - sidebarWidth;
    this.flyAreaHeight = flyAreaHeight;

    this.bg
      .clear()
      .roundRect(0, 0, this.flyAreaWidth, this.flyAreaHeight, 20)
      .fill(0x000022);

    this.multiplierText.x = this.flyAreaWidth / 2;
    this.multiplierText.y = 60;
  }

  update(ticker: Ticker) {

  const delta = ticker.deltaTime;

  this.time += delta * 1;

  const multiplier = Math.exp(0.06 * this.time);

  this.multiplierText.text = multiplier.toFixed(2) + "x";

  this.drawGraph(multiplier);
}

  drawGraph(multiplier: number) {

    const x = multiplier * 120;
    const y = this.flyAreaHeight - multiplier * multiplier * 20;

    this.graph.lineStyle(4, 0xff3b3b);
    this.graph.lineTo(x, y);

    this.plane.x = x;
    this.plane.y = y;
  }

}