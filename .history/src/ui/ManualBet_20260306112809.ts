import {Container , Graphics , Text } from "pixi.js"

export class ManualBet extends Container{
    private bg : Graphics;
    constructor(){
        super() 
         this.bg = new Graphics;
        this.build()
      
    }
    build(){
    const bg = new Graphics();
    bg.roundRect(100,100,100,100).fill(0x22222)
  
this.addChild(bg)
    }
    

}