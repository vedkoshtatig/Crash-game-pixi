import { socket } from "../services/crashSocket.ts"
import { EventEmitter } from "events"

export const gameEvents = new EventEmitter()

export class GameController {

  private isBetting = false
  private isFlying = false

  constructor() {
    this.initSocket()
  }

  initSocket() {

    socket.onAny((event, data) => {

      // GRAPH TIMER
      if (event.includes("graphTimer")) {

        const running = data.data.runningStatus
        const tenths = data.data.secondTenths
        const time = tenths / 10

        // BETTING PHASE
        if (!running && !this.isBetting) {

          this.isBetting = true
          this.isFlying = false

          gameEvents.emit("round:waiting", { time })

          console.log("Place your bets")
        }

        // FLYING PHASE
        if (running && !this.isFlying) {

          this.isFlying = true
          this.isBetting = false

          gameEvents.emit("round:start")

          console.log("Plane taking off")
        }

        // multiplier update
        if (running) {
          gameEvents.emit("plane:update", { time })
        }

      }

      // CRASH
      if (event.includes("roundStopped")) {

        const crashRate = data.data.crashRate

        this.isFlying = false
        this.isBetting = false

        gameEvents.emit("plane:crash", { crashRate })

        console.log("Plane crashed at", crashRate)
      }

    })

  }

}