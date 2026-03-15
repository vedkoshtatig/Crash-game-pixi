export type GamePhase =
  | "IDLE"
  | "WAITING"
  | "FLYING"
  | "CRASHED"
  | "CASHED_OUT";
export class CrashGameStore {
  private static _instance: CrashGameStore;

  public balance = 10000;
public roundId = 0;
  public betAmount = 0;
  public hasBet = false;

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
  public placeBet(amount: number) {
    if (this.hasBet) return;
  if (this.phase !== "WAITING") return;
  if (this.balance < amount) return;

  this.betAmount = amount;
  this.balance -= amount;
  this.hasBet = true;

  this.notify();
}
public startFlying(crashPoint: number) {
  this.phase = "FLYING";
  this.multiplier = 1;
  this.crashPoint = crashPoint;
  this.hasCashedOut = false;
  this.winAmount = 0;

  this.notify();
}
public updateMultiplier(value: number) {
  if (this.phase !== "FLYING") return;

  this.multiplier = value;

  this.notify();
}
public cashOut() {
  if (!this.hasBet) return;
  if (this.phase !== "FLYING") return;
  if (this.hasCashedOut) return;

  this.hasCashedOut = true;
  this.phase = "CASHED_OUT";

  this.winAmount = this.betAmount * this.multiplier;

  this.balance += this.winAmount;

  this.notify();
}
public crash() {
  this.phase = "CRASHED";

  if (!this.hasCashedOut && this.hasBet) {
    this.winAmount = 0;
  }

  this.addHistory(this.crashPoint);

  this.hasBet = false;
  this.betAmount = 0;
this.multiplier = this.crashPoint;
  this.notify();
}
public startWaiting() {
  this.roundId++;

  this.phase = "WAITING";
  this.multiplier = 1;
  this.crashPoint = 0;
  this.hasCashedOut = false;
  this.winAmount = 0;

  this.notify();
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
public cancelBet() {
  if (!this.hasBet) return;
  if (this.phase !== "WAITING") return;

  this.balance += this.betAmount;
  this.betAmount = 0;
  this.hasBet = false;

  this.notify();
}
public get liveWinAmount() {
//   if (!this.hasBet) return 0;
  return this.betAmount * this.multiplier;
}
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