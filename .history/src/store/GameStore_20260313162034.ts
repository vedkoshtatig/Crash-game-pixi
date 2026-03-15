import { ApiClient } from "../services/ApiClient";
export type GamePhase =
  | "IDLE"
  | "WAITING"
  | "FLYING"
  | "CRASHED"
  | "CASHED_OUT";

export class CrashGameStore {
  private static _instance: CrashGameStore;
  private api = new ApiClient("USER_TOKEN_")
  public balance = 10000;
  public roundId = 0;

  public betAmount = 1;          // editable UI amount
  public currentRoundBet = 0;    // locked bet for active round

  public hasBet = false;
  public scheduledBet = false;

  public multiplier = 1;
  public crashPoint = 0;

  public phase: GamePhase = "IDLE";

  public hasCashedOut = false;
  public winAmount = 0;

  public history: { crashPoint: number; time: number }[] = [];

  private listeners: (() => void)[] = [];

  private constructor() {}

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

  //  USER ACTIONS

  placeBet() {

    if (this.phase === "WAITING") {

      if (this.hasBet) return;

      this.currentRoundBet = this.betAmount;
      this.balance -= this.currentRoundBet;
      this.hasBet = true;

    } else {

      // schedule for next round
      this.scheduledBet = true;

    }

    this.notify();
  }

  cancelBet() {

    if (this.phase === "WAITING" && this.hasBet) {

      this.balance += this.currentRoundBet;
      this.hasBet = false;

    }

    if (this.scheduledBet) {
      this.scheduledBet = false;
    }

    this.notify();
  }

  setBetAmount(v: number) {

    if (this.hasBet) return;

    this.betAmount = Math.max(1, v);
    this.notify();
  }

  //  ROUND MUTATIONS (called by controller)

  onRoundWaiting() {

    this.multiplier = 1;
    this.hasCashedOut = false;
    this.winAmount = 0;

    if (this.scheduledBet) {

      this.currentRoundBet = this.betAmount;
      this.balance -= this.currentRoundBet;
      this.hasBet = true;
      this.scheduledBet = false;

    }

    this.notify();
  }

  startFlying() {

    this.multiplier = 1;
    this.hasCashedOut = false;
    this.winAmount = 0;

    this.notify();
  }

  updateMultiplier(value: number) {

    if (this.phase !== "FLYING") return;

    this.multiplier = value;
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

  cashOut() {

    if (!this.hasBet) return;
    if (this.phase !== "FLYING") return;
    if (this.hasCashedOut) return;

    this.hasCashedOut = true;

    this.winAmount = this.currentRoundBet * this.multiplier;
    this.balance += this.winAmount;

    this.hasBet = false;

    this.setPhase("CASHED_OUT");
  }

  //  DERIVED STATE

  public get liveWinAmount() {
    if (!this.hasBet) return 0;
    return this.currentRoundBet * this.multiplier;
  }

  private addHistory(point: number) {

    this.history.unshift({
      crashPoint: point,
      time: Date.now()
    });

    if (this.history.length > 12) {
      this.history.pop();
    }
  }

  //  REACTIVITY

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}
// export type GamePhase =
//   | "IDLE"
//   | "WAITING"
//   | "FLYING"
//   | "CRASHED"
//   | "CASHED_OUT";
// export class CrashGameStore {
//   private static _instance: CrashGameStore;

//   public balance = 10000;
// public roundId = 0;
//   public betAmount = 1;
//   public hasBet = false;
// public scheduledBet: boolean = false;
//   public multiplier = 1;
//   public crashPoint = 0;
// public currentRoundBet : number=1;
//   public phase: GamePhase = "IDLE";

//   public hasCashedOut = false;
//   public winAmount = 0;

//   public history: { crashPoint: number; time: number }[] = [];

//   private listeners: (() => void)[] = [];

//   private constructor() {}

//   public static get instance() {
//     if (!this._instance) {
//       this._instance = new CrashGameStore();
//     }
//     return this._instance;
//   }
// placeBet() {

//    if (this.phase === "WAITING") {
//       // normal instant bet
//       if (this.hasBet) return;

//       this.currentRoundBet = this.betAmount;
//       this.balance -= this.currentRoundBet;
//       this.hasBet = true;
//    }

//    else {
//       // ⭐ schedule for next round
//       this.scheduledBet = true;
//    }

//    this.notify();
// }
// setBetAmount(v: number) {
//   if (this.hasBet) return;
// //   if (this.phase !== "WAITING") return;

//   this.betAmount = Math.max(1, v);
//   this.notify();
// }
// public startFlying(crashPoint: number) {
//   this.phase = "FLYING";
//   this.multiplier = 1;
//   this.crashPoint = crashPoint;
//   this.hasCashedOut = false;
//   this.winAmount = 0;

//   this.notify();
// }
// public updateMultiplier(value: number) {
//   if (this.phase !== "FLYING") return;

//   this.multiplier = value;

//   this.notify();
// }
// public cashOut() {
//   if (!this.hasBet) return;
//   if (this.phase !== "FLYING") return;
//   if (this.hasCashedOut) return;

//   this.hasCashedOut = true;
//   this.phase = "CASHED_OUT";

//   this.winAmount = this.betAmount * this.multiplier;
//   this.balance += this.winAmount;

//   this.hasBet = false;   // ⭐ IMPORTANT
// //   this.betAmount = 0;    // ⭐ reset slot

//   this.notify();
// }
// public crash() {
//   this.phase = "CRASHED";

//   if (!this.hasCashedOut && this.hasBet) {
//     this.winAmount = 0;
//   }

//   this.addHistory(this.crashPoint);

//   this.hasBet = false;
// //   this.betAmount = 0;
// this.multiplier = this.crashPoint;
//   this.notify();
// }
// onRoundWaiting() {

//    this.phase = "WAITING";

//    if (this.scheduledBet) {
//       this.currentRoundBet = this.betAmount;
//       this.balance -= this.currentRoundBet;
//       this.hasBet = true;
//       this.scheduledBet = false;
//    }

//    this.notify();
// }
// private addHistory(point: number) {
//   this.history.unshift({
//     crashPoint: point,
//     time: Date.now()
//   });

//   if (this.history.length > 12) {
//     this.history.pop();
//   }
// }
// cancelBet() {

//    if (this.phase === "WAITING" && this.hasBet) {
//       this.balance += this.currentRoundBet;
//       this.hasBet = false;
//    }

//    if (this.scheduledBet) {
//       this.scheduledBet = false;
//    }

//    this.notify();
// }
// public get liveWinAmount() {
//   if (!this.hasBet) return 0;
//   return this.betAmount * this.multiplier;
// }
// public subscribe(fn: () => void) {
//   this.listeners.push(fn);
//   return () => {
//     this.listeners = this.listeners.filter((l) => l !== fn);
//   };
// }

// private notify() {
//   this.listeners.forEach((l) => l());
// }
// }