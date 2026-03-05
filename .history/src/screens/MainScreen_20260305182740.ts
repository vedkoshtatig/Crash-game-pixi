import { Container } from "pixi.js";
import { Header } from "../layout/Header";
import { SideBar } from "../layout/SideBar";
import { PlayArea } from "../playarea/PlayArea";

export class MainScreen extends Container {

  public header: Header;
  public sideBar: SideBar;
  public playArea: PlayArea;

  constructor() {
    super();

    this.header = new Header();
    this.sideBar = new SideBar();
    this.playArea = new PlayArea();

    this.addChild(
      this.header,
      this.sideBar,
      this.playArea,
    );
  }

}