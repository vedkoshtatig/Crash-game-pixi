import {Container , Graphics , Text } from "pixi.js"
import { app } from "../main";
export class ManualBet extends Container{
    private bg : Graphics;
    constructor(){
        super() 
         this.bg = new Graphics;
        this.build()
      
    }
    build(){
    this.bg.rect(100,100,100,100).fill(0xff000)
  

    }

}