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
}