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

  // ⭐ hydration state
  private hydrated = false
  private firstRealtimeResolver!: () => void
  private firstRealtimePromise = new Promise<void>(res => {
    this.firstRealtimeResolver = res
  })

  constructor() {
    const token = getAuthToken()
    this.api = new ApiClient(token)
  }

  // ⭐ called from boot loader
  public async start(onProgress?: (p: number) => void) {

    // step 1 → history
    await this.loadHistory()
    onProgress?.(0.3)

    // step 2 → socket connect
    this.initSocket()
    onProgress?.(0.6)

    // step 3 → wait realtime engine signal
    await this.firstRealtimePromise
    onProgress?.(1)

    this.hydrated = true
  }

  // ⭐ HISTORY API
  private async loadHistory() {
    try {
      const res = await this.api.getCrashHistory(20, 0)

      const history = res.data.rows.map((r: any) => r.crashRate)

      gameEvents.emit("history:update", history)

    } catch (e) {
      console.log("HISTORY API FAILED", e)
    }
  }

  // ⭐ SOCKET ENGINE
  private initSocket() {

    socket.onAny((event, payload) => {

      const data = payload?.data

      // ⭐ hydration realtime unlock
      if (!this.hydrated) {
        this.firstRealtimeResolver?.()
      }

      // ⭐ ROUND CREATED
      if (event.includes("roundStarted")) {

        const roundId = data.roundId
        this.store.roundId = roundId

        this.flightStarted = false
        this.zeroSeen = false

        gameEvents.emit("round:created", { roundId })

        this.loadHistory()
        return
      }

      // ⭐ WAITING PHASE
      if (event.includes("waitingTimer")) {

        const seconds = data.seconds

        if (this.store.phase !== "WAITING") {
          this.store.setPhase("WAITING")
          this.store.onRoundWaiting()
        }

        gameEvents.emit("round:waiting", { seconds })
        return
      }

      // ⭐ BETTING LOCKED → FLIGHT START
      if (event.includes("roundBettingOnHold")) {

        this.store.setPhase("FLYING")
        this.store.startFlying()

        gameEvents.emit("round:start")
        return
      }

      // ⭐ MULTIPLIER TICKS
      if (event.includes("graphTimer")) {

        const running = data.runningStatus
        const tenths = data.secondTenths

        if (running) {

          if (tenths === 0) {
            if (this.zeroSeen) return
            this.zeroSeen = true
          }

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
          return
        }

        // ⭐ CRASH DETECT
        if (!running) {

          const crashRate = data.crashRate

          this.flightStarted = false
          this.zeroSeen = false

          this.store.crashPoint = crashRate
          this.store.setPhase("CRASHED")
          this.store.crash()
this.loadHistory()
          gameEvents.emit("plane:crash", { crashRate })

          this.loadHistory()
          return
        }
      }

      // ⭐ ROUND STOPPED (safety history refresh)
      if (event.includes("roundStopped")) {
        this.loadHistory()
      }

    })

  }

}