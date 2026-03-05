import { Graphics , Text , Container,Application } from "pixi.js";  
import { app } from "../main";
export class Header extends Container{
private logo !: Text;
private app!: Application
constructor(){
    super();
    this.build()
 
    
}
build(){
     const rect = new Graphics()
     .rect(0,0,app.screen.width,40)
     .fill(0xff000)
     
     const logo = new Text({
        text: "Aviator",
     });
     logo.position.set(5,0)
     const currency = new Text({
        text: "USD",
     });
     
     currency.position.set(app.screen.width*0.99,0)
     currency.anchor.set(1,0)
     const amount = new Text({
        text: "30000",
     });
     amount.position.set(app.screen.width-currency.width,0)
     amount.anchor.set(1,0)
     
     this.addChild(rect,logo)
}
}