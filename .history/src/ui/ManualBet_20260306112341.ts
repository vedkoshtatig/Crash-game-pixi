import {Container , Graphics , Text } from "pixi.js"
import { app } from "../main";
export class ManualBet extends Container{
    private bg : Graphics;
    constructor(){
        super()
        this.build()
        this.bg = new Graphics;
    }
    build(){
    this.bg.rect(100,100,100,100).fill(0xff000)
    app.stage.addChild(this.bg)

    }

}