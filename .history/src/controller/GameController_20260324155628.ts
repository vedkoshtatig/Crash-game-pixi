import { socket } from "../services/crashSocket"
import { EventEmitter } from "events"
import { CrashGameStore } from "../store/GameStore"
import { ApiClient } from "../services/ApiClient"
import { getAuthToken } from "../services/getAuthtoken"
export const gameEvents = new EventEmitter()

export class GameController {

  private flightStarted = false
  private zeroSeen = false
  private store = CrashGameStore.instance
private api: ApiClient
  constructor() {
     const token = getAuthToken()
  this.api = new ApiClient(token)

  this.initSocket()

  // ⭐ load history on game boot
 
    this.loadHistory()
  }
private async loadHistory() {
  try {

    const res = await this.api.getCrashHistory(20, 0)

const history = res.data.rows
  .map((r: any) => r.crashRate)
  

console.log("HISTORY ARRAY", history)

gameEvents.emit("history:update", history)
    gameEvents.emit("history:update", history)

  } catch (e) {
    console.log("HISTORY API FAILED", e)
  }
}
  private initSocket() {

    socket.onAny((event, payload) => {

      const data = payload?.data

      //  ROUND CREATED
      if (event.includes("roundStarted")) {

        const roundId = data.roundId
        this.store.roundId = roundId

        this.flightStarted = false
        this.zeroSeen = false

        gameEvents.emit("round:created", { roundId })
        return
      }

      //  WAITING PHASE
      if (event.includes("waitingTimer")) {

        const seconds = data.seconds

        if (this.store.phase !== "WAITING") {

          this.store.setPhase("WAITING")
          this.store.onRoundWaiting()

        }

        gameEvents.emit("round:waiting", { seconds })
        this.loadHistory()
        return
      }

      //  BETTING LOCKED
     if (event.includes("roundBettingOnHold")) {

  this.store.setPhase("FLYING")
  this.store.startFlying()

  gameEvents.emit("round:start")
   
  return
}

      //  FLIGHT TIMER (multiplier ticks)
      if (event.includes("graphTimer")) {

        const running = data.runningStatus
        const tenths = data.secondTenths

       
       if(running){

       
        //  server zero tick duplicate guard
        if (tenths === 0) {
          if (this.zeroSeen) return
          this.zeroSeen = true
        }

        //  FLIGHT START TRANSITION
        if (!this.flightStarted) {

          this.flightStarted = true

          this.store.setPhase("FLYING")
          this.store.startFlying()

          gameEvents.emit("round:start")
        }

        const time = tenths / 10
        const multiplier = Math.pow(2, time * 0.09)

        this.store.updateMultiplier(multiplier)

        gameEvents.emit("plane:update", { time, multiplier })
        return}
       if (!running) {

  const crashRate = data.crashRate

  this.flightStarted = false
  this.zeroSeen = false

  this.store.crashPoint = crashRate

  this.store.setPhase("CRASHED")
  this.store.crash()

  gameEvents.emit("plane:crash", { crashRate })

  // ⭐⭐⭐ VERY IMPORTANT
  this.loadHistory()

  return
}
      }

      //  CRASH EVENT
      if (event.includes("roundStopped")) {

      
      }

    })

  }
}


// import { socket } from "../services/crashSocket.ts";
// import { EventEmitter } from "events";
// import { CrashGameStore } from "../store/GameStore";

// export const gameEvents = new EventEmitter();

// export class GameController {
//   private flightStarted = false;
//   private zeroSeen = false;
//   private store = CrashGameStore.instance;

//   constructor() {
//     this.initSocket();
//   }

//   initSocket() {
//     socket.onAny((event, data) => {

//       //  ROUND CREATED
//       if (event.includes("roundStarted")) {
//         const roundId = data.data.roundId;

//         this.store.roundId = roundId;
//         gameEvents.emit("round:created", { roundId });

//         console.log("New round created");
//       }

//       //  WAITING PHASE (betting open)
//       if (event.includes("waitingTimer")) {
//         const seconds = data.data.seconds;

//         if (this.store.phase !== "WAITING") {
//           this.store.onRoundWaiting();
//         }

//         gameEvents.emit("round:waiting", { seconds });
//         console.log("Betting countdown:", seconds);
//       }

//       //  BETTING CLOSED
//       if (event.includes("roundBettingOnHold")) {
//         gameEvents.emit("round:locked");
//         console.log("Bets locked");
//       }

//       //  FLIGHT GRAPH TIMER
//       if (event.includes("graphTimer")) {
//         const running = data.data.runningStatus;
//         const tenths = data.data.secondTenths;

//         if (running) {

//           // prevent duplicate zero tick bug from server
//           if (tenths === 0) {
//             if (this.zeroSeen) return;
//             this.zeroSeen = true;
//           }

//           //  FLIGHT START
//           if (!this.flightStarted) {
//             this.flightStarted = true;

//             this.store.startFlying(0); // crash point unknown yet
//             gameEvents.emit("round:start");
//           }

//           const time = tenths / 10;
//           const multiplier = Math.pow(2, time * 0.09);

//           this.store.updateMultiplier(multiplier);

//           gameEvents.emit("plane:update", { time, multiplier });
//         }
//       }

//       //  CRASH EVENT
//       if (event.includes("roundStopped")) {
//         const crashRate = data.data.crashRate;

//         this.flightStarted = false;
//         this.zeroSeen = false;

//         this.store.crashPoint = crashRate;
//         this.store.crash();

//         gameEvents.emit("plane:crash", { crashRate });

//         console.log("Plane crashed at", crashRate);
//       }
//     });
//   }
// }