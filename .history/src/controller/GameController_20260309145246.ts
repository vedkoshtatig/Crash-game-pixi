import { socket } from "../services/crashSocket.ts"
import { EventEmitter } from "events"

export const gameEvents = new EventEmitter()

export class GameController {
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

  const running = data.data.runningStatus
  const tenths = data.data.secondTenths
  const time = tenths / 10

  if (running) {

    // start flight if not started yet
    if (time === 0) {
      gameEvents.emit("round:start")
    }

    gameEvents.emit("plane:update", { time })

  }

}

      // CRASH EVENT
      if (event.includes("roundStopped")) {

        const crashRate = data.data.crashRate

        gameEvents.emit("plane:crash", { crashRate })

        console.log("Plane crashed at", crashRate)
      }

    })

  }

}