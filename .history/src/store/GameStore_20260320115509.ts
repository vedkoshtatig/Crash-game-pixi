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
  public autoBetEnabled = false;

  private scheduledBetAmount: number = 0;
  public balance = 10000;
  public roundId = 0;
  private api!: ApiClient;
  public betAmount = 1; // editable UI amount
  public activeBets = new Map<string, number>();     // cardId → betAmount
public scheduledBets = new Map<string, number>();  // cardId → betAmount
public cashedOutCards = new Set<string>();         // cards already cashed
public winAmounts = new Map<string, number>();     // cardId → win

  public multiplier = 1;
  public crashPoint = 0;

  public phase: GamePhase = "IDLE";

  public hasCashedOut = false;
  public winAmount = 0;

  public history: { crashPoint: number; time: number }[] = [];

  private listeners: (() => void)[] = [];

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
    this.autoBetEnabled = val;
    this.notify();
  }
  //  USER ACTIONS

  async placeBet(amount: number, cardId: string) {
  if (this.phase !== "WAITING") return;
  if (this.activeBets.has(cardId)) return;

  try {
    await this.api.placeBet(amount);

    this.activeBets.set(cardId, amount);

    // remove schedule if existed
    this.scheduledBets.delete(cardId);

  } catch (e) {
    console.log(e);
  }

  this.notify();
}
scheduleBet(amount: number, cardId: string) {
  if (this.activeBets.has(cardId)) return;

  this.scheduledBets.set(cardId, amount);
  this.notify();
}
cancelScheduledBet(cardId: string) {
  this.scheduledBets.delete(cardId);
  this.notify();
}
async cancelBet(cardId: string) {
  if (this.phase !== "WAITING") return;
  if (!this.activeBets.has(cardId)) return;

  await this.api.cancelBet();

  this.activeBets.delete(cardId);
  this.notify();
}

  // setBetAmount(v: number) {
  //   if (this.hasBet) return;

  //   this.betAmount = Math.max(1, v);
  //   this.notify();
  // }

  //  ROUND MUTATIONS (called by controller)
 async onRoundWaiting() {
  this.phase = "WAITING";
this.activeBets.clear();  
  this.cashedOutCards.clear();
  this.winAmounts.clear();
  this.multiplier = 1;

  // move scheduled → active
  for (const [cardId, amt] of this.scheduledBets) {
    await this.placeBet(amt, cardId);
  }

  this.scheduledBets.clear();

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

  // all active bets that did NOT cashout are losses
  for (const [cardId, amount] of this.activeBets) {

    if (!this.cashedOutCards.has(cardId)) {
      this.winAmounts.set(cardId, 0);
    }

  }

  this.phase = "CRASHED";

  this.addHistory(this.crashPoint);

  this.multiplier = 1;

  this.notify();
}
  //  PLAYER DRIVEN TRANSITION
async cashOut(cardId: string) {
  if (this.phase !== "FLYING") return;
  if (!this.activeBets.has(cardId)) return;
  if (this.cashedOutCards.has(cardId)) return;

  try {
    const res = await this.api.cashOut();

    this.cashedOutCards.add(cardId);
    this.winAmounts.set(cardId, res.data.winningAmount);

    this.notify();

  } catch (e) {
    console.log(e);
  }
}

  //  DERIVED STATE

  public  liveWinAmount(cardId: string) {
  const amt = this.activeBets.get(cardId);
  if (!amt) return 0;
  return amt * this.multiplier;
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
