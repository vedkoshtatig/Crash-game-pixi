import { Container, Assets } from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export class SpineJet extends Container {
  private jet: Spine;

  constructor() {
    super();

    const spineData = Assets.get("jetSpine");

    this.jet = new Spine(spineData);

    this.jet.x = 300;
    this.jet.y = 500;
    this.jet.scale.set(0.4);

    // ⭐ default animation
    this.jet.state.setAnimation(0, "idle", true);

    this.addChild(this.jet);
  }

  playRun() {
    this.jet.state.setAnimation(0, "run", true);
  }

  playTakeoff() {
    this.jet.state.setAnimation(0, "takeoff", false);
  }

  playFly() {
    this.jet.state.setAnimation(0, "fly", true);
  }

  playCrash() {
    this.jet.state.setAnimation(0, "blast", false);
  }
}