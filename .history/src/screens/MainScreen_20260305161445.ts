import { Assets, Container, Sprite } from "pixi.js";
import { app } from "../main";




export class MainScreen extends Container {
  private bgImg?: Sprite;
  private chipAnimator!: ChipAnimation;
  public header!: Header;
  public betPanel!: BetPanel;
  public footer!: Footer;
  public aside!: Aside;
  constructor() {
    super();
    this.init();
  }

  async init() {
    await Assets.loadBundle("main");

    this.bgImg = Sprite.from("betBG.png");
    this.bgImg.width = app.screen.width;
    this.bgImg.height = app.screen.height;

    this.header = new Header();

    this.betPanel = new BetPanel();
    this.footer = new Footer();
    this.aside = new Aside();
    Game.registerUI({
      header: this.header,
      footer: this.footer,
      betPanel: this.betPanel,
      aside: this.aside,
    });
    this.chipAnimator = new ChipAnimation();
    this.betPanel.onBetPlaced = (placement) => {
      this.chipAnimator.playChipAnimation(placement);
    };

    this.addChild(
      this.bgImg,
      this.header,
      this.betPanel,
      this.footer,
      this.aside,
    );

    // const wheel = new Wheel();
    // this.addChild(wheel);
  }
}
