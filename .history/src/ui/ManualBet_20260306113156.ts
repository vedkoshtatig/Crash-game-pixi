import {Container , Graphics , Text } from "pixi.js"

export class ManualBet extends Container{
    private bg : Graphics;
    constructor(){
        super() 
         this.bg = new Graphics;
        this.build()
      
    }
    build(){
  
    this.bg.roundRect(0,0,100,100).fill(0x222222)
  
this.addChild(this.bg)
    }
    

}