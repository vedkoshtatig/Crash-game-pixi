export let app: Application;

(async () => {
  const loadingBar = document.getElementById("loading-bar") as HTMLDivElement;
  const loadingText = document.getElementById("loading-text") as HTMLParagraphElement;
  const loadingScreen = document.getElementById("loading-screen") as HTMLDivElement;

  await document.fonts.load('16px "Montserrat-b"');
  await document.fonts.ready;

  await AssetLoader.instance.loadAll((p) => {
    const percent = Math.round(p * 100);

    // 🔥 Update UI
    loadingBar.style.width = percent + "%";
    loadingText.innerText = percent + "%";

    console.log("Loading:", percent + "%");
  });

  // 🔥 Hide loading screen smoothly
  loadingScreen.style.opacity = "0";
  loadingScreen.style.pointerEvents = "none";

  setTimeout(() => {
    loadingScreen.remove();
  }, 500);

  // 🔥 Init Pixi AFTER loading
  app = new Application();

  await app.init({
    background: "#000000",
    resizeTo: document.getElementById("pixi-container")!,
    antialias: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const mainScreen = new MainScreen();
  app.stage.addChild(mainScreen);

  new GameController();
})();