export class PlayArea extends Container {

  public betHistory: BetHistory
  public flyArea: FlyArea
  public betPanel: BetPanel

  constructor(){
    super()

    this.betHistory = new BetHistory()
    this.flyArea = new FlyArea()
    this.betPanel = new BetPanel()

    this.addChild(
      this.betHistory,
      this.flyArea,
      this.betPanel
    )
  }
}