import { Container, Sprite, Text, Texture, Assets, Graphics } from "pixi.js";
import { app } from "../../main";
import { gameEvents } from "../../controller/GameController";
import { gsap } from "gsap";
import { CrashGameStore } from "../../store/GameStore";
import { Skeleton, Spine } from "@esotericsoftware/spine-pixi-v8";
// await Assets.load(["/bg.png","/plane-idle.png" , "/plane-run.png" ,"/plane-blast.png","Clouds_01.png"]);

export class FlyArea extends Container {
  private skyOverlay!: Graphics;
  private skyState = { t: 0 };
  private skyAnimating = false;
  private plane!: Spine;
  private blast!: Spine;
  private crashHistory: number[] = [];
  private countdownInterval?: any;
  private cloudsActive: boolean = false;
  private serverTime: number = 0;
  private lastUpdate: number = 0;
  private isWaiting: boolean = false;
  private bg!: Sprite;
  private bgDrift = false;
  private multiplierText!: Text;
  private timerText!: Text;
  private bgOffsetX = 0;
  private bgOffsetY = 0;
  private flyWidth: number = 0;
  private flyHeight: number = 0;
  private takeoffPlayed = false;
private worldProgressX = 0;
private worldProgressY = 0;
  private startX: number = 0;
  private startY: number = 0;

  private clouds: Sprite[] = [];
  private planetTextures = [
    Texture.from("/Planet1.png"),
    Texture.from("/Planet2.png"),
    Texture.from("/Planet3.png"),
    Texture.from("/Planet4.png"),
  ];

  private planets: Sprite[] = [];
  private planetsActive = false;

  private isFlying: boolean = false;
  private isCrashed: boolean = false;
  private areaMask!: Graphics;
  private viewWidth: number = 0;
  private viewHeight: number = 0;
  private placeBetText!: Text;
  private cloudTexture = Texture.from("/Clouds_01.png");
  private idleTexture = Texture.from("/plane-idle.png");
  private runTexture = Texture.from("/plane-run.png");
  private blastTexture = Texture.from("/plane-blast.png");

  constructor() {
    super();
    this.init();
    this.layout();
    this.initEvents();
    this.createClouds();

    app.ticker.add(this.update, this);
  }

  init() {
    
    this.blast = Spine.from({
      skeleton: "blastSpine",
      atlas: "blastSpineAtlas",
    });
    this.bg = new Sprite(Texture.from("/bg.png"));
    this.bg.anchor.set(0, 1);
    // ⭐ always behind everything
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

    this.plane = Spine.from({
      skeleton: "jetSpine",
      atlas: "jetSpineAtlas",
    });
    const bounds = this.plane.getLocalBounds();

    this.plane.pivot.set(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    );
    const planeScale = Math.min(this.flyWidth, this.flyHeight) / 10000;
this.plane.scale.set(planeScale);
    this.plane.state.setAnimation(0, "Rest", true);

    this.multiplierText = new Text({
      text: "1.00x",
      style: {
        fill: "#ffd54a",
        fontSize: 96,
        fontWeight: "900",
      },
    });

    this.skyOverlay = new Graphics();
    this.addChild(this.skyOverlay);
    this.areaMask = new Graphics();
    this.addChild(this.areaMask);
    this.mask = this.areaMask;
    this.addChild(
      this.bg,
      this.plane,
      this.multiplierText,
      this.timerText,
      this.placeBetText
    );
    console.log(this.pla);
  }
  public resize(w: number, h: number) {
    // ⭐ store previous relative offset
    if (this.flyWidth > 0 && this.flyHeight > 0) {
      this.bgOffsetX = (this.bg.x - this.flyWidth / 2) / this.flyWidth;
      this.bgOffsetY = (this.bg.y - this.flyHeight / 2) / this.flyHeight;
    }

    this.viewWidth = w;
    this.viewHeight = h;

    this.skyOverlay.clear().rect(0, 0, w, h).fill(0x00aaff);

    this.areaMask.clear().rect(0, 0, w, h).fill(0xffffff);

    this.layout();

    // ⭐ restore cinematic drift position proportionally
    if (!this.bgDrift) {
      this.bg.x = this.worldProgressX * this.flyWidth;
this.bg.y = this.worldProgressY * this.flyHeight;
    }
    this.clouds.forEach(c => this.spawnCloud(c));
  }
  createClouds() {
    // ⭐ density based on screen size
    const area = this.viewWidth * this.viewHeight;
    const cloudCount = Math.floor(area / 90000) + 12;
    // mobile ~12
    // desktop ~18-24
    // ultra wide ~30+

    const marginX = this.flyWidth * 0.8;
    const marginY = this.flyHeight * 1.2;

    for (let i = 0; i < cloudCount; i++) {
      const cloud = new Sprite(this.cloudTexture);
      cloud.anchor.set(0.5);

      // ⭐ parallax depth scale
      const scale = 0.18 + Math.random() * 0.35;
      cloud.scale.set(scale);

      cloud.alpha = 0;
      cloud.visible = false;

      // ⭐ FULL cinematic sky volume distribution
      cloud.x = -marginX + Math.random() * (this.flyWidth + marginX * 2);

      cloud.y = -marginY + Math.random() * (this.flyHeight + marginY * 2);

      // ⭐ motion personality
      (cloud as any).baseSpeed = 0.8 + Math.random() * 0.6;
      (cloud as any).flow = 0.7 + Math.random() * 0.6;

      this.clouds.push(cloud);
      this.addChildAt(cloud, 1);
    }
  }
  updateClouds() {
    const mult = CrashGameStore.instance.multiplier;

    for (let cloud of this.clouds) {
      const baseSpeed = (cloud as any).baseSpeed;
      const flow = (cloud as any).flow;

      let speed = baseSpeed + mult * 1.5;
      speed = Math.min(speed, 8);
      const depth = cloud.scale.x;

      // ⭐ stable diagonal motion
      cloud.x -= speed * depth * flow;
      cloud.y += speed * depth * flow;

      const margin = 400;

      // ⭐ recycle from TOP or RIGHT randomly
      if (cloud.x < -margin || cloud.y > this.flyHeight + margin) {
        this.spawnCloud(cloud); // ⭐ SAME distribution
      }
    }
  }
  private spawnCloud(cloud: Sprite) {
    const margin = 350;

    if (Math.random() < 0.5) {
      // ⭐ spawn from RIGHT side
      cloud.x = this.flyWidth + Math.random() * 200;
      cloud.y = -margin + Math.random() * this.flyHeight * 0.7;
    } else {
      // ⭐ spawn from TOP side
      cloud.x = -margin + Math.random() * this.flyWidth * 1.2;
      cloud.y = -margin - Math.random() * 200;
    }
  }
  update() {
    this.worldProgressX = this.bg.x / this.flyWidth;
this.worldProgressY = this.bg.y / this.flyHeight;
    if (this.bgDrift) {
      const mult = CrashGameStore.instance.multiplier;

      // cinematic acceleration curve
      const speed = 2 + Math.log(mult + 1) * 0.8;

      const horizonY = this.flyHeight * 0.65;
      // ⭐ remember: higher y = LOWER on screen

      // ⭐ always move world backward
      this.bg.x -= speed * 2.3;

      // ⭐ ONLY after take-off → move world downward
      const runwayTime = 0.42;

      if (this.serverTime > runwayTime) {
        const liftTime = this.serverTime - runwayTime;

        // ⭐ how fast acceleration builds
        const accelDuration = 1.1;

        // 0 → 1 smooth progress
        const t = Math.min(liftTime / accelDuration, 1);

        // ⭐ cinematic easing (ease-in cubic)
        const ease = t * t * t;

        this.bg.y += speed * 2.9 * ease;
        const planeScale = Math.min(this.flyWidth, this.flyHeight) / 10000;
this.plane.scale.set(planeScale);
      }
    }
    if (this.cloudsActive) {
      this.updateClouds();
    }
    if (this.skyAnimating) {
      const time = this.serverTime;

      // how fast sky darkens (tweak this)
      const DARKEN_SPEED = 0;

      // ⭐ continuous deterministic progress
      const t = Math.min(time * DARKEN_SPEED, 1);

      const start = 0x38c4ff;
      const mid = 0x0066cc;
      const end = 0x000f3d;

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
    const runwayTime = 0.4;
    if (!this.takeoffPlayed && this.serverTime >= runwayTime) {
      this.takeoffPlayed = true;

      this.plane.state.setAnimation(0, "Take-off", false);
      const fly =this.plane.state.addAnimation(0, "Flying", true, 0);
      fly.timeScale = 0.35;   // slower (half speed)
     
    }
    this.flyPlane(this.serverTime);
    if (this.isCrashed) {
  this.blast.update(dt);
}
    this.plane.update(dt);
    this.lastUpdate = now;
  }
  private resetSky() {
    this.skyAnimating = false;
    this.skyState.t = 0;

    this.skyOverlay
      .clear()
      .rect(0, 0, this.viewWidth, this.viewHeight)
      .fill(0x00aaff); // bright start sky
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
    this.flyWidth = this.viewWidth;
    this.flyHeight = this.viewHeight;
    if(this.flyWidth>=920){
      this.startX = this.flyWidth * 0.15;
    this.startY = this.flyHeight * 0.75;
    }else{
       this.startX = this.flyWidth * 0.15;
    this.startY = this.flyHeight * 0.7;
    }
    

    const centerX = this.flyWidth / 2;
    const centerY = this.flyHeight / 2;

    this.multiplierText.anchor.set(0.5);
    this.multiplierText.position.set(centerX, centerY);

    this.timerText.anchor.set(0.5);
    this.timerText.position.set(centerX, centerY - 100);

    this.placeBetText.anchor.set(0.5);
    this.placeBetText.position.set(centerX, centerY);
    const scale = Math.min(this.flyWidth, this.flyHeight) / 900;

    this.multiplierText.style.fontSize = 96 * scale;
    this.timerText.style.fontSize = 60 * scale;
    this.placeBetText.style.fontSize = 40 * scale;

    if (!this.isFlying && !this.isCrashed) {
      this.plane.position.set(this.startX, this.startY);
    }
   const planeScale = Math.min(this.flyWidth, this.flyHeight) / 10000;
this.plane.scale.set(planeScale);
    if (!this.bgDrift) {
      // this.bg.position.set(this.flyWidth / 2, this.flyHeight / 2 -40);////////////change
    }

    // cover style scaling
    const scaleX = this.flyWidth / this.bg.texture.width;
    const scaleY = this.flyHeight / this.bg.texture.height;
    const scale2 = Math.max(scaleX, scaleY);
    this.bg.width = this.flyWidth;
    this.bg.height = this.flyHeight;
    this.bg.scale.set(scale2 * 1); // little zoom for drift space
  }
  initEvents() {
    gameEvents.on("round:waiting", (data: { seconds: number }) => {
      if (this.isWaiting) return;
      this.removeChild(this.blast)
      // this.blast.destroy();
      this.plane.visible = true;
      this.bgDrift = false;
      this.bg.position.set(0, this.flyHeight); ///////////////Change
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
      this.takeoffPlayed = false;
      this.bgDrift = true;
      console.log("Plane taking off");
      this.skyAnimating = true;
      this.isWaiting = false;
      this.serverTime = 0;
      this.lastUpdate = performance.now();

      this.plane.position.set(this.startX, this.startY);
      this.plane.rotation = 0;

      this.isFlying = true;
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
    // if (this.plane.state.getCurrent(0)?.animation.name !== "run") {
    // this.plane.state.setAnimation(0, "Fly", true);

    this.multiplierText.text = multiplier.toFixed(2) + "x";

    const runwayTime = 0.4;

    // ⭐ responsive horizontal bounds (same visual feel)
    const maxX = this.flyWidth - this.flyWidth * 0.25;

    const planeSpeed = this.flyWidth * 0.42;
const x = Math.min(this.startX + time * planeSpeed, maxX);
    const reachedCruise = x >= maxX;

    // ⭐ cloud trigger same timing feel
    const clampPoint = maxX * 0.92;

    if (!this.cloudsActive && time > runwayTime + 0.15) {
      this.cloudsActive = true;

      this.clouds.forEach((cloud) => {
        // ⭐ spawn fresh diagonal corridor
        const margin = 400;

        if (Math.random() < 0.5) {
          cloud.x = this.flyWidth + Math.random() * 200;
          cloud.y = -margin + Math.random() * this.flyHeight * 0.6;
        } else {
          cloud.x = -margin + Math.random() * this.flyWidth * 1.2;
          cloud.y = -margin;
        }

        cloud.visible = true;

        gsap.fromTo(cloud, { alpha: 0 }, { alpha: 0.7, duration: 0.8 });
      });
    }

    // ⭐ responsive cruise height (old 420 equivalent)
  const cruiseY = this.flyHeight * (0.32 + 0.04 * Math.min(this.flyWidth / 1400, 1));

    let y;

    if (time < runwayTime) {
      y = this.startY;
    } else {
      const flyTime = time - runwayTime;

      // ⭐ same parabola feel as old "350"
      const climbY =
        this.startY - Math.pow(flyTime, 2) * (this.flyHeight * 0.32);

      if (climbY > cruiseY) {
        y = climbY;
      } else {
        const t = performance.now() * 0.004;

        const hoverOffset =
          Math.sin(t) * (this.flyHeight * 0.006) +
          Math.sin(t * 2.3) * (this.flyHeight * 0.003) +
          Math.sin(t * 5.7) * (this.flyHeight * 0.0015);

        y = cruiseY ;
      }
    }

    this.plane.position.set(x, y);

    // ⭐ same rotation logic as old
    if (time > runwayTime) {
      const flyTime = time - runwayTime;
      const targetRotation = Math.min(flyTime * 0.4, 0.45);

      if (reachedCruise) {
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
    this.plane.visible = false;
    this.blast.x=this.plane.x
    this.blast.y=this.plane.y
    const bounds = this.blast.getLocalBounds();

    this.blast.pivot.set(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    );
    this.blast.scale.set(0.25);
    this.blast.state.setAnimation(0, "Blast", false);
    this.addChild(this.blast)
    this.bgDrift = false;
    this.skyAnimating = false;
    // this.plane.texture = this.blastTexture;
    this.multiplierText.text = `${rate.toFixed(2)}x`;
    this.multiplierText.style.fill = 0xff0000;

 

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
    this.takeoffPlayed = false;
    this.plane.state.setAnimation(0, "Rest", true);
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
