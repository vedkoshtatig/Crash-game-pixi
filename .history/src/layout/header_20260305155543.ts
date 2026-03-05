import { Graphics , Text , Container } from "pixi.js";  

export class Header extends Container{
private logo !: Text;
constructor(){
    super();
    this.includeInBuild()
    
}
}