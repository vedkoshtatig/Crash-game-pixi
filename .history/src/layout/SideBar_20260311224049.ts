import { Graphics, Container, Text} from "pixi.js";

import { gameEvents } from "../controller/GameController";
import { app } from "../main";

export class SideBar extends Container {

  private bg!: Graphics;
private resultCard!: Graphics;
private resultTitle!: Text;
private resultValue!: Text;

private tabsBg!: Graphics;
private previousTab!: Graphics;

private roundCard!: Graphics;

private headerRow!: Graphics;

private footer!: Graphics;

private titleAll!: Text;
private titlePrev!: Text;
private titleTop!: Text;

private roundTitle!: Text;
private roundValue!: Text;

private colPlayer!: Text;
private colBet!: Text;
private colX!: Text;
private colWin!: Text;

private listContainer!: Container;

private history: number[] = [];
  constructor() {
    super();

    this.init();
    this.layout();

    window.addEventListener("resize", () => this.layout());
  }

  init() {
    this.tabsBg = new Graphics();
this.previousTab = new Graphics();
this.roundCard = new Graphics();
this.headerRow = new Graphics();
this.footer = new Graphics();

this.addChild(
  this.tabsBg,
  this.previousTab,
  this.roundCard,
  this.headerRow,
  this.footer
);

this.titleAll = new Text({ text:"All Bets", style:{ fill:"#7f8b99", fontSize:16 }});
this.titlePrev = new Text({ text:"Previous", style:{ fill:"#ffffff", fontSize:16, fontWeight:"bold"}});
this.titleTop = new Text({ text:"Top", style:{ fill:"#7f8b99", fontSize:16 }});

this.roundTitle = new Text({ text:"Round Result", style:{ fill:"#8b97a6", fontSize:18 }});
this.roundValue = new Text({ text:"1.12x", style:{ fill:"#3fa9ff", fontSize:46, fontWeight:"bold"}});

this.colPlayer = new Text({ text:"Player", style:{ fill:"#6f7c8c", fontSize:15 }});
this.colBet = new Text({ text:"Bet USD", style:{ fill:"#6f7c8c", fontSize:15 }});
this.colX = new Text({ text:"X", style:{ fill:"#6f7c8c", fontSize:15 }});
this.colWin = new Text({ text:"Win USD", style:{ fill:"#6f7c8c", fontSize:15 }});

this.addChild(
  this.titleAll,
  this.titlePrev,
  this.titleTop,
  this.roundTitle,
  this.roundValue,
  this.colPlayer,
  this.colBet,
  this.colX,
  this.colWin
);

this.listContainer = new Container();
this.addChild(this.listContainer);
  this.bg = new Graphics();
  this.addChild(this.bg);

  this.resultCard = new Graphics();
  this.addChild(this.resultCard);

  this.resultTitle = new Text({
    text: "Round Result",
    style: {
      fill: "#8b97a6",
      fontSize: 18,
      fontWeight: "bold"
    }
  });

  this.resultValue = new Text({
    text: "1.00x",
    style: {
      fill: "#3fa9ff",
      fontSize: 42,
      fontWeight: "bold"
    }
  });

  this.addChild(this.resultTitle);
  this.addChild(this.resultValue);

  this.listContainer = new Container();
  this.addChild(this.listContainer);

  this.initEvents();
}
initEvents() {
  gameEvents.on("history:update", (history: number[]) => {

    this.history = history;

    if (!history.length) return;

    const last = history[0];

    this.resultValue.text = last.toFixed(2) + "x";

    // ⭐ color logic like casino
    if (last >= 10) this.resultValue.style.fill = "#ff9f43";
    else if (last >= 2) this.resultValue.style.fill = "#00ff88";
    else this.resultValue.style.fill = "#3fa9ff";

    this.renderBetList();
  });
}
renderBetList() {

  this.listContainer.removeChildren();

  const sidebarWidth = this.bg.width;

  let y = 0;

  for (let i = 0; i < 14; i++) {

    const row = new Graphics()
      .roundRect(0, y, sidebarWidth - 20, 52, 14)
      .fill(0x11161d);

    const name = new Text({
      text: "d***" + Math.floor(Math.random() * 9),
      style: { fill: "#c7d0db", fontSize: 18 }
    });

    const bet = new Text({
      text: "100.00",
      style: { fill: "#c7d0db", fontSize: 18 }
    });

    const win = new Text({
      text: "0.00",
      style: { fill: "#8b97a6", fontSize: 18 }
    });

    name.x = 60;
    name.y = y + 16;

    bet.x = sidebarWidth - 170;
    bet.y = y + 16;

    win.x = sidebarWidth - 70;
    win.y = y + 16;

    this.listContainer.addChild(row, name, bet, win);

    y += 60;
  }
}
layout(){

const { width, height } = app.screen;

const sidebarWidth = width / 3.7;
const headerHeight = height / 16;
const panelHeight = height - headerHeight;

// main bg
this.bg.clear()
.roundRect(0,0,sidebarWidth,panelHeight,22)
.fill(0x0b0f14);

// tabs bg
this.tabsBg.clear()
.roundRect(15,15,sidebarWidth-30,46,30)
.fill(0x121821);

// selected tab
this.previousTab.clear()
.roundRect(sidebarWidth/2-70,20,140,36,20)
.fill(0x2a2f36);

// tabs text
this.titleAll.position.set(40,28);
this.titlePrev.position.set(sidebarWidth/2-35,28);
this.titleTop.position.set(sidebarWidth-90,28);

// round card
this.roundCard.clear()
.roundRect(15,75,sidebarWidth-30,110,20)
.fill(0x121821);

this.roundTitle.x = sidebarWidth/2 - this.roundTitle.width/2;
this.roundTitle.y = 90;

this.roundValue.x = sidebarWidth/2 - this.roundValue.width/2;
this.roundValue.y = 115;

// header row
this.headerRow.clear()
.rect(15,200,sidebarWidth-30,34)
.fill(0x141a21);

this.colPlayer.position.set(25,207);
this.colBet.position.set(sidebarWidth/2-20,207);
this.colX.position.set(sidebarWidth-120,207);
this.colWin.position.set(sidebarWidth-70,207);

// list start
this.listContainer.x = 15;
this.listContainer.y = 240;

// footer
this.footer.clear()
.roundRect(15,panelHeight-40,sidebarWidth-30,28,12)
.fill(0x121821);

}
renderRows(){

this.listContainer.removeChildren();

let y = 0;
const sidebarWidth = this.bg.width;

for(let i=0;i<14;i++){

const row = new Graphics()
.roundRect(0,y,sidebarWidth-30,48,22)
.fill(0x0e1319);

const name = new Text({
text:"d***"+(Math.floor(Math.random()*9)),
style:{ fill:"#c7d0db", fontSize:16 }
});

const bet = new Text({
text:"100.00",
style:{ fill:"#c7d0db", fontSize:16 }
});

const win = new Text({
text:"0.00",
style:{ fill:"#8b97a6", fontSize:16 }
});

name.position.set(50,y+14);
bet.position.set(sidebarWidth/2-10,y+14);
win.position.set(sidebarWidth-70,y+14);

this.listContainer.addChild(row,name,bet,win);

y += 54;
}
}
}