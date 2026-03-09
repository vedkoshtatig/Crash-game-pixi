import { socket } from "../services/crashSocket.ts"
import { EventEmitter } from "events"

export const gameEvents = new EventEmitter()

export class GameController {

  constructor() {
    this.initSocket()
  }

  initSocket() {

    socket.onAny((event, data) => {

      // WAITING PHASE
      if (event.includes("roundBettingOnHold")) {
        gameEvents.emit("round:waiting")
      }

      // GRAPH TIMER
      if (event.includes("graphTimer")) {

        const running = data.data.runningStatus
        const tenths = data.data.secondTenths
        const time = tenths / 10

        if (!running) {
          // runway / countdown
          gameEvents.emit("round:start", {
            time
          })
        }

        if (running) {
          // plane flying
          gameEvents.emit("plane:update", {
            time
          })
        }

      }

      // CRASH
      if (event.includes("roundStopped")) {

        const crashRate = data.data.crashRate

        gameEvents.emit("plane:crash", {
          crashRate
        })

        gameEvents.emit("round:end")
      }

    })

  }

}