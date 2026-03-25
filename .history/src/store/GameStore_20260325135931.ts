import { ApiClient } from "../services/ApiClient";
import { getAuthToken } from "../services/getAuthtoken";
export type GamePhase =
  | "IDLE"
  | "WAITING"
  | "FLYING"
  | "CRASHED"
  | "CASHED_OUT";

export class CrashGameStore {
  private static _instance: CrashGameStore;
public autoBetEnabled = false

private hydrated = false;

private resolveHydration() {
  if (!this.hydrated) {
    this.hydrated = true;
    this.resolveFirstState();
  }
}
  public balance = 10000;
  public roundId = 0;
  private api!: ApiClient;
  public betAmount = 1; // editable UI amount
  public currentRoundBet = 0; // locked bet for active round

  public hasBet = false;
  public scheduledBet = false;

  public multiplier = 1;
  public crashPoint = 0;

  public phase: GamePhase = "IDLE";

  public hasCashedOut = false;
  public winAmount = 0;

  public history: { crashPoint: number; time: number }[] = [];

  private listeners: (() => void)[] = [];
public autoCashoutEnabled = false
public autoCashoutMultiplier = 20 // ⭐ default target (future use)
  private constructor() {
    const token = getAuthToken();

    console.log("TOKEN =", token);

    this.api = new ApiClient(token);
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new CrashGameStore();
    }
    return this._instance;
  }
 
  //  CONTROLLER PHASE AUTHORITY
  setPhase(next: GamePhase) {
    this.phase = next;
    this.notify();
  }
setAutoBet(val: boolean) {

  this.autoBetEnabled = val

  // ⭐ if user turned ON during waiting → instant bet
  if (
    val &&
    this.phase === "WAITING" &&
    !this.hasBet
  ) {
    this.placeBet()
  }

  // ⭐ if turned ON during flying/crashed → schedule next
  if (
    val &&
    this.phase !== "WAITING"
  ) {
    this.scheduleBet()
  }

  this.notify()
}
  //  USER ACTIONS

 async placeBet() {

  // REAL BET ONLY IN WAITING
  if (this.phase !== "WAITING") {
    this.scheduleBet()
    return
  }

  if (this.hasBet) return
  if(this.autoCashoutMultiplier>20){
    this.autoCashoutMultiplier=20;
  }
  try {
    const res = await this.api.placeBet(this.betAmount,this.autoCashoutMultiplier)

    this.hasBet = true
    this.currentRoundBet = this.betAmount
    this.scheduledBet=false
    console.log("BET SUCCESS", res)

  
  } catch (e) {
    console.log("BET FAILED", e)
    this.scheduledBet = false   // remove ghost waiting UI
    this.hasBet = false
    this.currentRoundBet = 0
  }
  this.notify()
}
scheduleBet() {
  if (this.hasBet) return
  if (this.scheduledBet) return

  this.scheduledBet = true

  console.log("BET SCHEDULED CLIENT SIDE")

  this.notify()
}
cancelScheduledBet() {
  if (!this.scheduledBet) return

  this.scheduledBet = false

  console.log("SCHEDULED BET CANCELLED")

  this.notify()
}
  async cancelBet() {

  if (this.phase !== "WAITING") return
  if (!this.hasBet) return

  try {
    await this.api.cancelBet()

    this.hasBet = false
    this.currentRoundBet = 0

    console.log("REAL BET CANCELLED")

    this.notify()
  } catch (e) {
    console.log("CANCEL FAILED", e)
  }
}
public toggleAutoCashout(inputValue?: number) {

  if (this.hasBet && !this.hasCashedOut) return

  this.autoCashoutEnabled = !this.autoCashoutEnabled

  if (this.autoCashoutEnabled) {
    // ON → take current input value
    if (inputValue && inputValue >= 1.01) {
      this.autoCashoutMultiplier = inputValue
    }
  } else {
    // OFF → reset default
    this.autoCashoutMultiplier = 100
  }

  this.notify()
}
setAutoCashoutMultiplier(v: number) {
  this.autoCashoutMultiplier = v
  this.notify()
}
  setBetAmount(v: number) {
    if (this.hasBet) return;

    this.betAmount = Math.max(1, v);
    this.notify();
  }

  //  ROUND MUTATIONS (called by controller)

 async onRoundWaiting() {

  this.multiplier = 1
  this.hasCashedOut = false
  this.winAmount = 0
  if (this.autoBetEnabled && !this.hasBet) {
    await this.placeBet()
  }

  if (this.scheduledBet) {
    
    await this.placeBet()
  }

  this.notify()
}

startFlying() {
  this.multiplier = 1;
  this.hasCashedOut = false;
  this.winAmount = 0;

  // ⭐ continuous auto bet chain
  if (this.autoBetEnabled) {
    this.scheduleBet()
  }

  this.notify();
}

 updateMultiplier(value: number) {

  if (this.phase !== "FLYING") return;

  this.multiplier = value;

  // ⭐ AUTO CASHOUT ENGINE
  if (
    this.autoCashoutEnabled &&
    this.hasBet &&
    !this.hasCashedOut &&
    this.multiplier >= this.autoCashoutMultiplier
  ) {
    console.log("AUTO CASHOUT TRIGGERED");

    this.hasCashedOut=true;
   
  }

  this.notify();
}

  crash() {
    if (!this.hasCashedOut && this.hasBet) {
      this.winAmount = 0;
    }

    this.addHistory(this.crashPoint);

    this.hasBet = false;
    this.multiplier = 1;

    this.notify();
  }

  //  PLAYER DRIVEN TRANSITION

  async cashOut() {
    if (this.phase !== "FLYING") return;
    if (!this.hasBet) return;
    if (this.hasCashedOut) return;

    try {
      const res = await this.api.cashOut();
     console.log("resss" , res);
      this.hasCashedOut = true;
      this.winAmount = res.data.winningAmount;

      // this.setPhase("CASHED_OUT");

      console.log("CASHOUT SUCCESS", res);

      this.notify();
    } catch (e) {
      console.log("CASHOUT FAILED", e);
    }
  }

  //  DERIVED STATE

  public get liveWinAmount() {
    if (!this.hasBet) return 0;
    return this.currentRoundBet * this.multiplier;
  }

  private addHistory(point: number) {
    this.history.unshift({
      crashPoint: point,
      time: Date.now(),
    });

    if (this.history.length > 12) {
      this.history.pop();
    }
  }

  //  REACTIVITY

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}
