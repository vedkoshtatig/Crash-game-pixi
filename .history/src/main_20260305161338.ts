import { Application, Assets, Text } from "pixi.js";
import { MainScreen } from "./screens/MainScreen";


export let app: Application;
(async () => {
  app = new Application();
  Game.init(app);
  await app.init({ background: "#000000", resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);
  await Assets.init({ manifest, basePath: "assets" });
  await Assets.loadBundle("preload");
  const allBundles = manifest.bundles.map((item) => item.name);
  Assets.backgroundLoadBundle(allBundles);

  const loadingText = new Text({
    text: "Loading...",
    style: { fontSize: 36, fill: 0xffffff },
  });
  loadingText.anchor.set(0.5);
  loadingText.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(loadingText);
  
  await GameStore.instance.getHistoryBets();
  const mainScreen = new MainScreen();

  app.stage.addChild(mainScreen);
  app.stage.removeChild(loadingText);
})();