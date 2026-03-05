import { app } from "../main";
import { MainScreen } from "../screens/MainScreen";

export class LayoutManager {

  static layout(main: MainScreen) {

    const screenW = app.screen.width;
    const screenH = app.screen.height;

    const headerHeight = screenH / 18;
    const sidebarWidth = screenW / 3.7;

    const betHistoryHeight = screenH / 18;
    const flyAreaHeight = screenH / 1.6;

    // HEADER
    main.header.resize(screenW, headerHeight);
    main.header.position.set(0, 0);

    // SIDEBAR
    main.sideBar.resize(sidebarWidth, screenH - headerHeight);
    main.sideBar.position.set(0, headerHeight);

    // PLAY AREA
main.playArea.position.set(sidebarWidth, headerHeight);

// CHILD SIZES FIRST
main.playArea.betHistory.resize(
  screenW - sidebarWidth,
  betHistoryHeight
);

main.playArea.flyArea.resize(
  screenW - sidebarWidth,
  flyAreaHeight
);

main.playArea.betPanel.resize(
  screenW - sidebarWidth,
  screenH - headerHeight - betHistoryHeight - flyAreaHeight
);

// THEN LAYOUT
main.playArea.resize(
  screenW - sidebarWidth,
  screenH - headerHeight
);