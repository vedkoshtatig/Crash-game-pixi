export class MainScreen extends Container {

  public header: Header
  public sideBar: SideBar
  public playArea: PlayArea

  constructor() {
    super()

    this.header = new Header()
    this.sideBar = new SideBar()
    this.playArea = new PlayArea()

    this.addChild(
      this.header,
      this.sideBar,
      this.playArea
    )
  }
}