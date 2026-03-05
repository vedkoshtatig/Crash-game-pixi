import { Graphics , Text , Container } from "pixi.js";  
import { app } from "../main";
export class Header extends Container{
private logo !: Text;
constructor(){
    super();
    this.build()
    
}
build(){
     const rect = new Graphics()
     .rect(0,100,100,100)

}
}