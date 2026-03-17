import { Container, Sprite, Text, Texture, Assets , Graphics } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { CrashGameStore } from "../../store/GameStore";

// await Assets.load(["/bg.png","/plane-idle.png" , "/plane-run.png" ,"/plane-blast.png","Clouds_01.png"]);

export class FlyArea extends Container {
  private flightPhase: "RUNNING" | "TAKEOFF" | "FLYING" = "RUNNING";
private skyOverlay!: Graphics;
private skyState = { t: 0 };
private skyAnimating = false;
  private plane!: Sprite;
  private crashHistory: number[] = [];
  private countdownInterval?: any;
  private cloudsActive: boolean = false;
  private serverTime: number = 0;
  private lastUpdate: number = 0;
  private isWaiting: boolean = false;
  // private multiplier: number = 1;

  private multiplierText!: Text;
  private timerText!: Text;

  private flyWidth: number = 0;
  private flyHeight: number = 0;

  private WORLD_WIDTH: number = 1920;
  private WORLD_HEIGHT: number = 1080;

  private startX: number = 0;
  private startY: number = 0;

  private clouds: Sprite[] = [];
  private cloudTexture = Texture.from("/Clouds_01.png");
  private world!: Container;
  private camProgress: number = 0;
  private camDuration: number = 1.5;
  private camAnimating: boolean = false;

  private zoomTriggered: boolean = false;
  private isFlying: boolean = false;
  private isCrashed: boolean = false;
  private viewportMask!: Sprite;
  private viewWidth: number = 0;
  private viewHeight: number = 0;
  private placeBetText!: Text;
  private camStart = {
    x: 0,
    y: 0,
    scale: 1.2,
  };

  private camEnd = {
    x: 0,
    y: 0,
    scale: 1.4,
  };

  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");
  private blastTexture = Texture.from("/plane-blast.png");

  constructor() {
    super();
    this.init();
    this.layout();
    this.initEvents();
    // this.createClouds();

    app.ticker.add(this.update, this);
  }

  init() {
 

    this.timerText = new Text({
      text: "0",
      style: {
        fill: "#ffffff",
        fontSize: 40,
        fontWeight: "bold",
      },
    });
    this.placeBetText = new Text({
      text: "Place Your Bets!",
      style: {
        fill: "#060303",
        fontSize: 40,
        fontWeight: "bold",
      },
    });
    this.timerText.visible = false;
    this.placeBetText.visible = false;

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

   this.world = new Container();
this.addChild(this.skyOverlay = new Graphics());   // ⭐ add before world
this.addChild(this.world);
    this.world.addChild(

      this.plane,
      this.multiplierText,
      this.timerText,
      this.placeBetText
    );
  }
  public resize(w: number, h: number) {
    this.viewWidth = w;
    this.viewHeight = h;

    const scale = Math.min(w / this.WORLD_WIDTH, h / this.WORLD_HEIGHT);

    // center world inside viewport
    this.world.scale.set(scale);

    this.world.x = (w - this.WORLD_WIDTH * scale) / 2;
    this.world.y = (h - this.WORLD_HEIGHT * scale) / 2;

    //  create mask
    if (!this.viewportMask) {
      this.viewportMask = Sprite.from(Texture.WHITE);
      this.addChild(this.viewportMask);
      this.mask = this.viewportMask;
    }

    this.viewportMask.width = w;
    this.viewportMask.height = h;
    this.viewportMask.position.set(0, 0);
this.skyOverlay
  .clear()
  .rect(0, 0, w, h)
  .fill(0x00aaff);
    this.layout();
  }
  createClouds() {
    const cloudCount = 18;

    for (let i = 0; i < cloudCount; i++) {
      const cloud = new Sprite(this.cloudTexture);
      cloud.anchor.set(0.5);

      const scale = 0.3 + Math.random() * 0.4;
      cloud.scale.set(scale);

      cloud.visible = false;
      cloud.alpha = 0;
      const margin = 350;
      const cam = this.getCameraBounds();

      if (Math.random() < 0.5) {
        // spawn above visible area
        cloud.x = cam.left + Math.random() * (cam.right - cam.left);
        cloud.y = cam.top - margin;
      } else {
        // spawn right side
        cloud.x = this.x + 100;
        cloud.y = -50;
      }

      (cloud as any).baseSpeed = 3;
      (cloud as any).initialBoost = true;

      this.clouds.push(cloud);
      this.world.addChildAt(cloud, 1);
    }
  }

  updateClouds() {
    for (let cloud of this.clouds) {
      const baseSpeed = (cloud as any).baseSpeed;

      let speed;
      speed = baseSpeed + CrashGameStore.instance.multiplier * 2;
      speed = Math.min(speed, 14);

      const depthFactor = cloud.scale.x;

      cloud.x -= speed * depthFactor;
      cloud.y += speed * depthFactor;

      const cam = this.getCameraBounds();
      const margin = 450;

      if (cloud.x < cam.left - margin || cloud.y > cam.bottom + margin) {
        if (Math.random() < 0.5) {
          cloud.x = cam.left + Math.random() * (cam.right - cam.left);
          cloud.y = cam.top - margin;
        } else {
          cloud.x = cam.right + margin;
          cloud.y = cam.top + Math.random() * (cam.bottom - cam.top);
        }
      }
    }
  }

  update() {

  if (this.camAnimating) {
    this.camProgress += app.ticker.deltaMS / 1000 / this.camDuration;

    if (this.camProgress >= 1) {
      this.camProgress = 1;
      this.camAnimating = false;
    }
  }

  // ⭐ SKY UPDATE MUST BE HERE (independent)
 if (this.skyAnimating) {

  // ⭐ EXACT SAME TIME DRIVER AS PLANE
  const time = this.serverTime;

  // how fast sky darkens (tweak this)
  const DARKEN_SPEED = 0.03;

  // ⭐ continuous deterministic progress
  const t = Math.min(time * DARKEN_SPEED, 1);

  const start = 0x00aaff;
  const mid   = 0x0066cc;
  const end   = 0x000f3d;

  let color;

  if (t < 0.6) {
    color = this.lerpColor(start, mid, t / 0.6);
  } else {
    color = this.lerpColor(mid, end, (t - 0.6) / 0.4);
  }

  this.skyOverlay
    .clear()
    .rect(0, 0, this.viewWidth, this.viewHeight)
    .fill(color);
}

  if (this.cloudsActive) this.updateClouds();
  if (!this.isFlying) return;

  const now = performance.now();
  const dt = (now - this.lastUpdate) / 1000;

  this.serverTime += dt;
  this.flyPlane(this.serverTime);

  this.lastUpdate = now;
}
private resetSky() {
  this.skyAnimating = false;
  this.skyState.t = 0;

  this.skyOverlay
    .clear()
    .rect(0, 0, this.viewWidth, this.viewHeight)
    .fill(0x00aaff);   // bright start sky
}
private lerpColor(a: number, b: number, t: number) {
  const ar = (a >> 16) & 255,
        ag = (a >> 8) & 255,
        ab = a & 255;

  const br = (b >> 16) & 255,
        bg = (b >> 8) & 255,
        bb = b & 255;

  const rr = ar + (br - ar) * t;
  const rg = ag + (bg - ag) * t;
  const rb = ab + (bb - ab) * t;

  return (rr << 16) + (rg << 8) + rb;
}
  layout() {
    this.flyWidth = this.WORLD_WIDTH;
    this.flyHeight = this.WORLD_HEIGHT;

  


    this.startX = this.flyWidth * 0.1;
    this.startY = this.flyHeight * 0.84;

    // ⭐ PERFECT VISUAL CENTER
    const centerX = this.WORLD_WIDTH / 2;
    const centerY = this.WORLD_HEIGHT / 2;

    this.multiplierText.anchor.set(0.5);
    this.multiplierText.position.set(centerX, centerY);

    this.timerText.anchor.set(0.5);
    this.timerText.position.set(centerX, centerY - 100);
    this.placeBetText.anchor.set(0.5);
    this.placeBetText.position.set(centerX, centerY);

    this.plane.scale.set(0.8);

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
  startCameraTransition() {
    // const { width, height } = app.screen;


  }

  initEvents() {
    gameEvents.on("round:waiting", (data: { seconds: number }) => {
      if (this.isWaiting) return;

      this.isCrashed = false;
      this.isWaiting = true;

      console.log("Waiting for next round");

      this.isFlying = false;
      this.serverTime = 0;
      this.lastUpdate = 0;

      this.resetScene();
      this.resetPlane();
      this.waitTimer(data.seconds);
    });

    gameEvents.on("round:start", () => {
      console.log("Plane taking off");
      this.skyAnimating = true;
      this.isWaiting = false;
      this.isFlying = true;
        this.flightPhase = "RUNNING";   // ⭐ reset phase
    });

    gameEvents.on(
      "plane:update",
      (data: { time: number; multiplier: number }) => {
        this.serverTime = data.time;
        // this.multiplier = data.multiplier;
        this.lastUpdate = performance.now();
      }
    );

    gameEvents.on("plane:crash", (data: { crashRate: number }) => {
      this.isFlying = false;
      this.crashPlane(data.crashRate);
    });
  }

  resetScene() {
    // const { width, height } = app.screen;

    this.cloudsActive = false;
    this.zoomTriggered = false;



    this.clouds.forEach((cloud) => {
      gsap.to(cloud, {
        alpha: 0,
        duration: 0.3,
        onComplete: () => {
          cloud.visible = false;

          if (Math.random() < 0.5) {
            cloud.x = Math.random() * this.flyWidth;
            cloud.y = -150;
          } else {
            cloud.x = this.flyWidth + 150;
            cloud.y = Math.random() * this.flyHeight;
          }
        },
      });
    });
  }

  flyPlane(time: number) {
    const multiplier = CrashGameStore.instance.multiplier;
    this.multiplierText.visible = true;
    this.multiplierText.style.fill = "#ffd54a";
    this.plane.texture = this.runTexture;
    this.multiplierText.text = multiplier.toFixed(2) + "x";

    const maxX = this.flyWidth -110;
    const maxY = 300;
    const runwayTime = 0.4;

    const x = Math.min(this.startX + time * 950, maxX);
    const reachedCruise = x >= maxX;
    if (!this.zoomTriggered && x >= this.flyWidth * 0.25) {
      this.zoomTriggered = true;

    }

    if (!this.cloudsActive && x >= this.flyWidth * 0.65) {
      this.cloudsActive = true;

      this.clouds.forEach((cloud) => {
        cloud.visible = true;
        cloud.alpha = 0;

        gsap.to(cloud, {
          alpha: 1,
          duration: 0.8,
        });
      });
    }

    let y;

    if (time < runwayTime) {
      y = this.startY;
    } else {
      const flyTime = time - runwayTime;

      const climbY = this.startY - Math.pow(flyTime, 2) * 350;

      if (climbY > maxY) {
        y = climbY;
      } else {
        // ⭐ TURBULENCE HOVER
        const t = performance.now() * 0.004;

        const hoverOffset =
          Math.sin(t) * 6 + // main float
          Math.sin(t * 2.3) * 3 + // jitter
          Math.sin(t * 5.7) * 1.5; // micro shake

        y = maxY + hoverOffset;
      }
    }

    this.plane.x = x;
    this.plane.y = y;

    if (time > runwayTime) {
      const flyTime = time - runwayTime;
      const targetRotation = Math.min(flyTime * 0.4, 0.45);

      if (reachedCruise) {
        // ⭐ lock rotation → NO turbulence rotation
        this.plane.rotation = -0.45;
      } else {
        this.plane.rotation = -targetRotation;
      }
    } else {
      this.plane.rotation = 0;
    }
  }

  waitTimer(seconds: number) {
    this.placeBetText.alpha = 1;
    this.placeBetText.scale.set(1);
    this.placeBetText.visible = true;
    this.timerText.style.fontSize = 60;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.multiplierText.visible = false;
    this.timerText.visible = true;
    this.timerText.style.fill = 0xffffff;

    let remaining = seconds;
    this.timerText.text = remaining.toString();

    const pulse = () => {
      gsap.killTweensOf(this.timerText.scale);
      gsap.killTweensOf(this.timerText);

      this.timerText.scale.set(1);

      gsap.fromTo(
        this.timerText.scale,
        { x: 0.6, y: 0.6 },
        {
          x: 1.4,
          y: 1.4,
          duration: 0.45,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        }
      );

      gsap.fromTo(
        this.timerText,
        { alpha: 0.5 },
        {
          alpha: 1,
          duration: 0.45,
          yoyo: true,
          repeat: 1,
        }
      );
    };

    pulse();

    this.countdownInterval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(this.countdownInterval);

        gsap.to([this.timerText, this.placeBetText], {
          scale: 2,
          alpha: 0,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            this.timerText.visible = false;
            this.placeBetText.visible = false;

            this.timerText.scale.set(1);
            this.timerText.alpha = 1;

            this.placeBetText.scale.set(1);
            this.placeBetText.alpha = 1;
          },
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

 
  this.skyAnimating = false;
    this.plane.texture = this.blastTexture;
    this.multiplierText.text = `Crashed @ ${rate.toFixed(2)}x`;
    this.multiplierText.style.fill = 0xff0000;

    this.plane.rotation = 2;

    // ⭐ PUSH TO HISTORY
    this.crashHistory.unshift(rate);

    // ⭐ optional limit history
    if (this.crashHistory.length > 20) {
      this.crashHistory.pop();
    }

    // ⭐ EMIT EVENT
    gameEvents.emit("history:update", this.crashHistory);

    console.log("CRASH", rate);
  }

 resetPlane() {

  this.plane.texture = this.idleTexture;
  this.plane.rotation = 0;

  gsap.killTweensOf(this.plane);

  const startLeft = -120;
  this.plane.position.set(startLeft, this.startY);

  gsap.to(this.plane, {
    x: this.startX,
    duration: 1,
    ease: "power2.out",

    
  });
   this.skyAnimating = false;
      this.skyState.t = 0;

      this.skyOverlay
        .clear()
        .rect(0, 0, this.viewWidth, this.viewHeight)
        .fill(0x00aaff);
}
  
}
