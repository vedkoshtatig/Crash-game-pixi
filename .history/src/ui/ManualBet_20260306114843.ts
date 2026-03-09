import { Container, Graphics } from "pixi.js";

export class ManualBet extends Container {

  public bg: Graphics;
  public selectorBg : Graphics;
  public bet : Text;
  public auto : Text;
  public betController : Graphics;
  public betAmount : Text;
  public predefinedBet : Graphics;
    

  constructor() {
    super();

    this.bg = new Graphics();
    this.selectorBg = new Graphics();
    this.bet = new Text()
    this.auto = new Text()
    this.betController = new Graphics()
    this.betAmount = new Text; 
    this.predefinedBet = new Graphics()
    this.addChild(this.bg,this.selectorBg);
  }

  layout(width: number, height: number) {

    this.bg.clear()
      .roundRect(0, 0, width, height, 20)
      .fill(0x222222);

    this.selectorBg.clear()
    .roundRect(0,0,215,30,15)
    .fill(0xff000)
    .pivot.set(107.5,0)
    this.selectorBg.position.set(width/2 ,8)

  }
}