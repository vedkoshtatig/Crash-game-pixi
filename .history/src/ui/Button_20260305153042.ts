import { Sprite, Texture } from "pixi.js";

export class Button extends Graphics {
  private normalTexture: Texture;
  // private hoverTexture: Texture;
  // private activeTexture: Texture;
  private onPointerDown: () => void;
  private isAnimating = false;

  constructor(
    normalTexture: Texture,

    onPointerDown: () => void,
  ) {
    super(normalTexture);

    this.normalTexture = normalTexture;
    // this.hoverTexture = hoverTexture;
    // this.activeTexture = activeTexture;
    this.onPointerDown = onPointerDown;

    this.interactive = true;
    this.eventMode = "static";
    this.cursor = "pointer";
    // this.scale.set(1);
    this.anchor.set(0.5);

    this.on("pointerover", () => this.onHover());
    this.on("pointerout", () => this.onPointerOut());
    this.on("pointerdown", () => this.onDown());
  }

  private onHover(): void {
    if (this.isAnimating) return;
    // this.texture = this.hoverTexture;
    // this.animateScale(this.scale.x + 0.1);
  }

  private onPointerOut(): void {
    if (this.isAnimating) return;
    this.texture = this.normalTexture;
    // this.animateScale(this.scale.x - 0.1);
  }

  private onDown(): void {
    // this.texture = this.activeTexture;
    // this.animateScale(this.scale.x - 0.05);
    this.onPointerDown();
  }
}