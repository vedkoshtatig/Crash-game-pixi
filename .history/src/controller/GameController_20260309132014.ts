import { socket } from "../services/crashSocket"
import { EventEmitter } from "events"

export const gameEvents = new EventEmitter()

export class GameController {

  constructor() {
    this.initSocket()
  }

  initSocket() {

    socket.onAny((event, data) => {

      if (event.includes("graphTimer")) {

        const running = data.data.runningStatus
        const tenths = data.data.secondTenths
        const time = tenths / 10

        gameEvents.emit("plane:update", {
          time,
          running
        })
      }

      if (event.includes("roundStopped")) {

        const crashRate = data.data.crashRate

        gameEvents.emit("plane:crash", {
          crashRate
        })
      }

      if (event.includes("roundBettingOnHold")) {

        gameEvents.emit("round:start")

      }

    })

  }

}