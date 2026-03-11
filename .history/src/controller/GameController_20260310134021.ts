import { socket } from "../services/crashSocket.ts"
import { EventEmitter } from "events"

export const gameEvents = new EventEmitter()

export class GameController {

  private flightStarted = false

  constructor() {
    this.initSocket()
  }

  initSocket() {

    socket.onAny((event, data) => {

      // ROUND CREATED
      if (event.includes("roundStarted")) {

        const roundId = data.data.roundId

        gameEvents.emit("round:created", { roundId })

        console.log("New round created")
      }

      // BETTING TIMER
      if (event.includes("waitingTimer")) {

        const seconds = data.data.seconds

        gameEvents.emit("round:waiting", { seconds })

        console.log("Betting countdown:", seconds)
      }

      // BETTING CLOSED
      if (event.includes("roundBettingOnHold")) {

        gameEvents.emit("round:locked")

        console.log("Bets locked")
      }

      // GRAPH TIMER (flight phase)
if (event.includes("graphTimer")) {
console.log(data.data);
  const running = data.data.runningStatus
  const tenths = data.data.secondTenths
  const time = tenths / 10

  if (running) {

    if (!this.flightStarted) {
      this.flightStarted = true
      gameEvents.emit("round:start")
    }

    const multiplier = Math.pow(2, time * 0.09);

    gameEvents.emit("plane:update", { time, multiplier })

  }
}

      // CRASH EVENT
     if (event.includes("roundStopped")) {

  const crashRate = data.data.crashRate

  this.flightStarted = false

  gameEvents.emit("plane:crash", { crashRate })

  console.log("Plane crashed at", crashRate)
}

    })

  }

}