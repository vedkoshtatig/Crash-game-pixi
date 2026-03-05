export class LayoutManager {

 static layout(main: MainScreen){

  const screenW = app.screen.width
  const screenH = app.screen.height

  const headerHeight = screenH / 18
  const sidebarWidth = screenW / 3.7

  const betHistoryHeight = screenH / 18
  const flyAreaHeight = screenH / 1.6

  // HEADER
  main.header.position.set(0,0)

  // SIDEBAR
  main.sideBar.position.set(0, headerHeight)

  // PLAY AREA
  main.playArea.position.set(sidebarWidth, headerHeight)

  // PLAY AREA CHILDREN

  main.playArea.betHistory.position.set(0,0)

  main.playArea.flyArea.position.set(
    0,
    betHistoryHeight
  )

  main.playArea.betPanel.position.set(
    0,
    betHistoryHeight + flyAreaHeight
  )

 }

}