import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class Button extends Container {

  private bg: Graphics;
  private btnText: Text;
  private onPointerDown: () => void;

  private widthBtn: number;
  private heightBtn: number;

  constructor(
    text: string,
    onPointerDown: () => void
  ) {
    super();

    this.widthBtn = width;
    this.heightBtn = height;
    this.pivot.set(width / 2, height / 2);
    this.onPointerDown = onPointerDown;

    this.bg = new Graphics();
    this.drawNormal();

    const style = new TextStyle({
      fill: "#ffffff",
      fontSize: 18,
      fontWeight: "bold"
    });

    this.btnText = new Text({
      text,
      style
    });

    this.btnText.anchor.set(0.5);
    this.btnText.x = width / 2;
    this.btnText.y = height / 2;

    this.addChild(this.bg);
    this.addChild(this.btnText);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", this.onHover.bind(this));
    this.on("pointerout", this.onOut.bind(this));
    this.on("pointerdown", this.onDown.bind(this));
  }

  private drawNormal() {
    this.bg.clear();
    this.bg.roundRect(0, 0, this.widthBtn, this.heightBtn, 10);
    this.bg.fill({ color: 0x2a2a2a });
  }

  private drawHover() {
    this.bg.clear();
    this.bg.roundRect(0, 0, this.widthBtn, this.heightBtn, 10);
    this.bg.fill({ color: 0x444444 });
  }

  private drawActive() {
    this.bg.clear();
    this.bg.roundRect(0, 0, this.widthBtn, this.heightBtn, 10);
    this.bg.fill({ color: 0x1a1a1a });
  }

  private onHover() {
    this.drawHover();
  }

  private onOut() {
    this.drawNormal();
  }

  private onDown() {
    this.drawActive();
    this.onPointerDown();
  }
}