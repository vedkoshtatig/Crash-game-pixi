import { socket } from "../services/crashSocket.ts";
import { EventEmitter } from "events";

export const gameEvents = new EventEmitter();

export class GameController {
  private flightStarted = false;
  private zeroSeen = false;
  private wasRunning = false;
  constructor() {
    this.initSocket();
  }

  initSocket() {
    socket.onAny((event, data) => {
      // ROUND CREATED
      if (event.includes("roundStarted")) {
        const roundId = data.data.roundId;

        gameEvents.emit("round:created", { roundId });

        console.log("New round created");
      }

      // BETTING TIMER
      if (event.includes("waitingTimer")) {
        const seconds = data.data.seconds;

        gameEvents.emit("round:waiting", { seconds });

        console.log("Betting countdown:", seconds);
      }

      // BETTING CLOSED
      if (event.includes("roundBettingOnHold")) {
        gameEvents.emit("round:locked");

        console.log("Bets locked");
      }

      // GRAPH TIMER (flight phase)
      // if (event.includes("graphTimer")) {
      //   console.log(data.data.runningStatus,data.data.secondTenths);
      //   console.log(event);
      //   const running = data.data.runningStatus;
      //   const tenths = data.data.secondTenths;
      //   const time = tenths / 10;

      //   if (running) {
      //     if (!this.flightStarted) {
      //       this.flightStarted = true;
      //       this.zeroTickConsumed = false; // ✅ reset for new round
      //       gameEvents.emit("round:start");
      //     }

    
      //     if (tenths === 0) {
      //       if (this.zeroTickConsumed) return;
      //       this.zeroTickConsumed = true;
      //     }

      //     const time = tenths / 10;
      //     const multiplier = Math.pow(2, time * 0.09);

      //     gameEvents.emit("plane:update", { time, multiplier });
      //   }
      // }
      // GRAPH TIMER (flight phase)
if (event.includes("graphTimer")) {

  const running = data.data.runningStatus;
  const tenths = data.data.secondTenths;

  console.log(tenths, running, event);

  // ⭐ detect crash EXACT moment flight stops
  if (this.wasRunning && !running) {

    this.flightStarted = false;
    this.zeroSeen = false;
    this.wasRunning = false;

    gameEvents.emit("plane:crash");   // instant crash
    return;
  }

  // ⭐ normal running updates
  if (running) {

    this.wasRunning = true;

    // allow only first zero
    if (tenths === 0) {
      if (this.zeroSeen) return;
      this.zeroSeen = true;
    }

    if (!this.flightStarted) {
      this.flightStarted = true;
      gameEvents.emit("round:start");
    }

    const time = tenths / 10;
    const multiplier = Math.pow(2, time * 0.09);

    gameEvents.emit("plane:update", { time, multiplier });
  }
}

      // CRASH EVENT
      // if (event.includes("roundStopped")) {
      //   const crashRate = data.data.crashRate;

      //   this.flightStarted = false;

      //   gameEvents.emit("plane:crash", { crashRate });

      //   console.log("Plane crashed at", crashRate);
      // }
    });
  }
}
