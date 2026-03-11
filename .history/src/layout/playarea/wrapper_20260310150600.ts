import {
  Application,
  Container,
  Sprite,
  AnimatedSprite,
  Graphics,
  type PointData,
  Point,
  Ticker,
} from "pixi.js";
import gsap from "gsap";
// import type { LoadedTextures } from "../../../hooks/useAssetsLoader";

export class Wrapper extends Container {
  private app: Application;
  // private texture: LoadedTextures;
  private bg_sun: Sprite;
  private blur: Sprite;

  private plane: AnimatedSprite;
  private curve: Graphics;

  private startPoint = { x: 0, y: 0 };
  private endPoint = { x: 0, y: 0 };
  private controlPoint = { x: 0, y: 0 };
  private mountPoint = { x: 0, y: 0 };
  private glidePoint = { x: 0, y: 0 };

  private drawProgress = 0; // 0 = nothing drawn, 1 = full curve

  private curveTween?: gsap.core.Tween;
  private glideTween?: gsap.core.Tween;
  private planeMountTimeline?: gsap.core.Timeline;
  private curveTicker?: Ticker;

  private gameState: "waiting" | "flying" | "flew" = "waiting";
  private backgroundTicker: Ticker;

  constructor(app: Application, texture: LoadedTextures) {
    super();
    this.app = app;
    this.scale.set(1 / window.devicePixelRatio);

    this.texture = texture;

    // Create sun sprite
    this.bg_sun = new Sprite("/assets/");
    this.bg_sun.anchor.set(0.5); // Center anchor
    this.addChild(this.bg_sun);

    this.blur = new Sprite(texture.characters.blur);
    this.blur.anchor.set(0.5);
    this.blur.visible = false; // Initially hidden

    // this.blur.alpha = 0.9; // Semi-transparent
    this.addChild(this.blur);

    // Create curve graphics
    this.curve = new Graphics();
    this.addChild(this.curve);

    this.backgroundTicker = new Ticker();
    this.backgroundTicker.add(() => {
      this.bgRotation();
    });

    // Create plane animation
    const planeFrames = [
      texture.characters.plane_0,
      texture.characters.plane_1,
      texture.characters.plane_2,
      texture.characters.plane_3,
    ];

    this.plane = new AnimatedSprite(planeFrames);
    this.plane.anchor.set(0.1, 0.9);
    // const isMobile = window.innerWidth < 768;
    // if (isMobile) {

    // if(window.innerWidth < 365){
    // this.plane.scale.set(0.95);

    // } else {
    // this.plane.scale.set(1.6);

    // }
    this.plane.scale.set(1.6);
    // } else {
    //   this.plane.scale.set(2);
    // }

    this.plane.animationSpeed = 0.2;
    this.plane.play();
    this.addChild(this.plane);

    this.handleResize();

    // this.animateCurveDrawing();

    // this.app.ticker.add(() => {
    //   this.bgRotation();
    // });

    // this.showAndHideAnimations(false);
  }

  private bgRotation() {
    this.bg_sun.rotation += 0.0025;
  }

  public changeBlurColor(color: string) {
    if (this.blur) {
      if (this.blur.tint === color) {
        return; // Color already set, no need to reapply
      }
      this.blur.tint = color;
    }
  }

  // public animateCurveDrawing() {
  //   const state = this.getGameState();
  //   if (state === "flying") {
  //     console.warn("Already flying, cannot start again.");
  //     return;
  //   }

  //   this.setGameState("flying");
  //   this.drawProgress = 0;

  //   // this.blur.alpha = 1; // Hide blur effect
  //   this.blur.visible = true;
  //   this.backgroundTicker.start();

  //   let planeStarted = false;
  //   gsap.ticker.fps(60);
  //   this.curveTween = gsap.to(this, {
  //     drawProgress: 1,
  //     duration: 5.5,
  //     ease: "sine.inOut",
  //     onUpdate: () => {
  //       this.drawCurve();

  //       const point = this.getQuadraticBezierPoint(
  //         this.drawProgress,
  //         this.startPoint,
  //         this.controlPoint,
  //         this.endPoint
  //       );

  //       if (!planeStarted && point.y < this.controlPoint.y + 10) {
  //         planeStarted = true;
  //         this.animatePlaneAlongCurve();
  //       }
  //     },
  //   });
  // }

  public animateCurveDrawing() {
    const state = this.getGameState();
    if (state === "flying") {
      console.warn("Already flying, cannot start again.");
      return;
    }

    this.setGameState("flying");
    this.drawProgress = 0;

    this.blur.visible = true;
    this.backgroundTicker.start();

    const duration = 5.5; // seconds
    const targetFPS = 60;
    let planeStarted = false;
    let elapsed = 0;

    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const ticker = new Ticker();
    ticker.autoStart = false;

    ticker.add((delta: number) => {
      // Convert delta frames to time
      elapsed += delta / targetFPS;
      const rawProgress = Math.min(elapsed / duration, 1);
      this.drawProgress = easeInOutSine(rawProgress);

      this.drawCurve();

      const point = this.getQuadraticBezierPoint(
        this.drawProgress,
        this.startPoint,
        this.controlPoint,
        this.endPoint
      );

      if (!planeStarted && point.y < this.controlPoint.y + 10) {
        planeStarted = true;
        this.animatePlaneAlongCurve();
      }

      if (rawProgress >= 1) {
        ticker.stop();
        ticker.destroy();
      }
    });

    ticker.start();
    this.curveTicker = ticker; // Save reference if needed
  }

  public flewAway() {
    if (this.getGameState() === "flew") {
      console.warn("Already flew away, cannot reset.");
      return;
    }

    this.setGameState("flew");
    this.drawProgress = 0;

    this.blur.visible = false;
    this.backgroundTicker.stop();

    this.curveTween?.kill();
    this.glideTween?.kill();
    this.planeMountTimeline?.kill();

    // ✅ Safe destroy
    this.safelyDestroyTicker(this.curveTicker);
    // @ts-ignore
    this.curveTicker = null;

    if (this.curve) {
      this.curve.clear();
      this.curve.alpha = 0;
    }

    const w = this.app.renderer.width;

    if (this.plane && this.plane.position) {
      gsap.to(this.plane.position, {
        x: w + 200,
        y: -200,
        duration: 0.6,
        ease: "power1.out",
        onComplete: () => {
          this.plane.visible = false;
        },
      });
    }
  }

  private safelyDestroyTicker(ticker?: Ticker | null) {
    if (!ticker) return;
    try {
      ticker.stop();
      ticker.destroy();
    } catch (e) {
      console.warn("Ticker already destroyed or invalid:", e);
    }
  }

  public resetPlane() {
    if (this.getGameState() === "waiting") {
      console.warn("Already waiting, cannot reset.");
      return;
    }

    this.setGameState("waiting");
    this.plane.visible = true;
    this.blur.visible = false;

    this.backgroundTicker.stop();

    this.plane.position.set(this.startPoint.x, this.startPoint.y);

    this.planeMountTimeline?.kill();
    this.glideTween?.kill();
    this.curveTween?.kill();

    this.curve.alpha = 1;
    this.curve.clear();
    this.drawProgress = 0;

    this.updatePlanePosition();
  }

  public showAndHideAnimations(value: boolean) {
    this.plane.alpha = value ? 1 : 0;
    this.curve.alpha = value ? 1 : 0;
  }

  public getPlaneAlphaAndCurve() {
    return {
      planeAlpha: this.plane.alpha,
      curveAlpha: this.curve.alpha,
    };
  }

  private drawCurve() {
    this.plane.visible = true;
    const g = this.curve;
    g.clear();

    const { x: sx, y: sy } = this.startPoint;
    const { x: cx, y: cy } = this.controlPoint;
    const { x: ex, y: ey } = this.endPoint;

    const t = this.drawProgress;

    const { planeAlpha, curveAlpha } = this.getPlaneAlphaAndCurve();

    // Compute partial end point on the curve
    const current = this.getQuadraticBezierPoint(
      t,
      this.startPoint,
      this.controlPoint,
      this.endPoint
    );

    // Fill below the curve
    g.beginFill(0xf00b3e, planeAlpha ? 0.4 : 0);
    g.moveTo(sx, sy);

    const steps = 650;

    for (let i = 1; i <= steps * t; i++) {
      const tt = i / steps;
      const pt = this.getQuadraticBezierPoint(
        tt,
        this.startPoint,
        this.controlPoint,
        this.endPoint
      );
      g.lineTo(pt.x, pt.y);
    }

    g.lineTo(current.x, this.startPoint.y); // downward side
    g.lineTo(sx, sy);
    g.endFill();

    g.lineStyle(0);
    g.beginFill(0x00ffff, 0); // Cyan fill
    g.drawCircle(cx, cy, 8); // radius 8
    g.endFill();

    // Stroke the curve
    g.lineStyle(6, 0xd0021b, planeAlpha ? 1 : 0);
    g.moveTo(sx, sy);

    for (let i = 1; i <= steps * t; i++) {
      const tt = i / steps;
      const pt = this.getQuadraticBezierPoint(
        tt,
        this.startPoint,
        this.controlPoint,
        this.endPoint
      );
      g.lineTo(pt.x, pt.y);
    }

    // Move plane to current position on the curve
    this.plane.position.set(current.x, current.y);
  }

  private getQuadraticBezierPoint(
    t: number,
    p0: PointData,
    p1: PointData,
    p2: PointData
  ): Point {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return new Point(x, y);
  }

  // private animatePlaneAlongCurve() {
  //   const MOUNT_TIME = 5;
  //   const GLIDE_TIME = 10;

  //   this.planeMountTimeline = gsap.timeline();

  //   this.planeMountTimeline
  //     .to(this.endPoint, {
  //       x: this.mountPoint.x,
  //       y: this.mountPoint.y ,
  //       ease: "power1.out",
  //       duration: MOUNT_TIME,
  //       onUpdate: () => {
  //         this.updatePlanePosition();
  //       },
  //     })
  //     .add(() => {
  //       // Looping wavy movement
  //       // @ts-ignore
  //       this.glideTween = gsap.timeline({ repeat: -1, yoyo: true });

  //       const amplitude = 80;
  //       const xOffset = window.innerWidth < 364 ? 150 : window.innerWidth < 500 ?250 :  250;

  //       // @ts-ignore
  //       this.glideTween?.to(this.endPoint, {
  //         x: this.glidePoint.x + xOffset,
  //         y: this.glidePoint.y + amplitude,
  //         duration: GLIDE_TIME / 2,
  //         ease: "sine.inOut",
  //         onUpdate: () => this.updatePlanePosition(),
  //       });
  //     });

  //   // this.planeMountTimeline
  //   //   .to(this.endPoint, {
  //   //     x: this.mountPoint.x,
  //   //     y: this.mountPoint.y,
  //   //     ease: "power1.out",
  //   //     duration: MOUNT_TIME,
  //   //     onUpdate: () => {
  //   //       this.updatePlanePosition();
  //   //     },
  //   //   })
  //   //   .add(() => {
  //   //     this.glideTween = gsap.to(this.endPoint, {
  //   //       x: this.glidePoint.x + 200,
  //   //       y: this.glidePoint.y,
  //   //       ease: "sine.inOut",
  //   //       yoyo: true,
  //   //       repeat: -1,
  //   //       duration: GLIDE_TIME,
  //   //       onUpdate: () => {
  //   //         this.updatePlanePosition();
  //   //       },
  //   //     });
  //   //   });
  // }
  private animatePlaneAlongCurve() {
    const MOUNT_TIME = 5;
    const GLIDE_TIME = 10;

    this.planeMountTimeline = gsap.timeline();

    this.planeMountTimeline
      .to(this.endPoint, {
        x: this.mountPoint.x,
        y: this.mountPoint.y - 50,
        ease: "power1.out",
        duration: MOUNT_TIME,
        onUpdate: () => {
          this.updatePlanePosition();
        },
      })
      .add(() => {
        // Looping wavy movement
        // @ts-ignore
        this.glideTween = gsap.timeline({ repeat: -1, yoyo: true });

        const amplitude = 80;
        const xOffset = window.innerWidth < 500 ? 250 : 250;

        // @ts-ignore
        this.glideTween?.to(this.endPoint, {
          x: this.glidePoint.x + xOffset,
          y: this.glidePoint.y + amplitude,
          duration: GLIDE_TIME / 2,
          ease: "sine.inOut",
          onUpdate: () => this.updatePlanePosition(),
        });
      });

    // this.planeMountTimeline
    //   .to(this.endPoint, {
    //     x: this.mountPoint.x,
    //     y: this.mountPoint.y,
    //     ease: "power1.out",
    //     duration: MOUNT_TIME,
    //     onUpdate: () => {
    //       this.updatePlanePosition();
    //     },
    //   })
    //   .add(() => {
    //     this.glideTween = gsap.to(this.endPoint, {
    //       x: this.glidePoint.x + 200,
    //       y: this.glidePoint.y,
    //       ease: "sine.inOut",
    //       yoyo: true,
    //       repeat: -1,
    //       duration: GLIDE_TIME,
    //       onUpdate: () => {
    //         this.updatePlanePosition();
    //       },
    //     });
    //   });
  }
  public setGameState(planeData: string) {
    if (
      planeData === "waiting" ||
      planeData === "flying" ||
      planeData === "flew"
    ) {
      this.gameState = planeData;
    } else {
      throw new Error(`Invalid game state: ${planeData}`);
    }
  }

  public getGameState() {
    return this.gameState;
  }

  public handleResize() {
    const w = this.app.renderer.width;
    const h = this.app.renderer.height;

    // ✅ For Sprite (not Spine)
    const originalWidth = this.bg_sun.texture.orig.width;
    const originalHeight = this.bg_sun.texture.orig.height;

    const scale = w / originalWidth;

    this.bg_sun.scale.set(scale * 2.5);
    // this.bg_sun.x = 1100 * scale;
    // this.bg_sun.y = h - 250 * scale;

    if (this.bg_sun) {
      this.bg_sun.position.set(0, h);
    }

    if (this.blur) {
      this.blur.scale.set(scale * 7.5, scale * 3.7);
      this.blur.position.set(w / 2, h / 2);
    }

    this.startPoint = { x: 15, y: h - 10 };
    this.endPoint = { x: w - 250, y: 300 };
    this.controlPoint = { x: w * 0.5, y: h * 1 }; // Higher value = shallower arc

    const planeWidth = this.plane.width;
    this.mountPoint = {
      x: Math.max(w - 1.5 * planeWidth, this.startPoint.x),
      y: Math.min(this.plane.height * 1.2, this.startPoint.y),
    };

    this.glidePoint = {
      x: w - 2 * planeWidth,
      y: this.plane.height * 3,
    };

    this.drawCurve();

    const state = this.getGameState();

    if (state === "flying") {
      this.animatePlaneAlongCurve();
    }
  }

  private updatePlanePosition() {
    const { x: sx, y: sy } = this.startPoint;
    const { x: cx, y: cy } = this.controlPoint;
    const { x: ex, y: ey } = this.endPoint;

    // Update plane position on current endPoint
    this.plane.position.set(ex, ey);
    this.drawCurve();
  }
}
