export type GamePhase =
  | "IDLE"
  | "WAITING"
  | "FLYING"
  | "CRASHED"
  | "CASHED_OUT";
export class CrashGameStore {
  private static _instance: CrashGameStore;

  public balance = 1000;

  public betAmount = 0;
  public hasBet = false;

  public multiplier = 1;
  public crashPoint = 0;

  public phase: GamePhase = "IDLE";

  public hasCashedOut = false;
  public winAmount = 0;

  public history: number[] = [];

  private listeners: (() => void)[] = [];

  private constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new CrashGameStore();
    }
    return this._instance;
  }
  public placeBet(amount: number) {
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
}