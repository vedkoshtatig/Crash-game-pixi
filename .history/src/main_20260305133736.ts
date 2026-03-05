import * as PIXI from "pixi.js";

const app = new PIXI.Application();

await app.init({
  resizeTo: window,      
  backgroundColor: 0x222222,
  antialias: true,
});


document.body.appendChild(app.canvas);