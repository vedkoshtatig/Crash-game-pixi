import { socket } from "../services/crashSocket"
import { EventEmitter } from "events"
import { CrashGameStore } from "../store/GameStore"
import { ApiClient } from "../services/ApiClient"
import { getAuthToken } from "../services/getAuthtoken"

export const gameEvents = new EventEmitter()

export class GameController {

  private store = CrashGameStore.instance
  private api: ApiClient

  constructor() {
    const token = getAuthToken()
    this.api = new ApiClient(token)

    this.initSocket()
    this.loadInitialState()
  }

  private async loadInitialState() {
    try {
      const res = await this.api.getRound()
      const history = res.data.previousRounds.map(r => parseFloat(r.crashRate))
      gameEvents.emit("history:update", history)

      // Sync UI to current round state on page load
      const current = res.data.currentRound
      if (current) {
        if (current.roundState === "1") {
          // Betting open — show bet form
          this.store.roundId = parseInt(current.id)
          this.store.setPhase("WAITING")
          gameEvents.emit("round:created", { roundId: current.roundId })
          gameEvents.emit("round:waiting", { seconds: 0 })
        } else if (current.roundState === "2") {
          // Graph running — jump straight into flying state
          this.store.roundId = parseInt(current.id)
          this.store.setPhase("FLYING")
          this.store.startFlying()
          gameEvents.emit("round:start")
        }
      }
    } catch (e) {
      console.log("INITIAL STATE LOAD FAILED", e)
    }
  }

  private async loadHistory() {
    try {
      const res = await this.api.getRound()
      const history = res.data.previousRounds.map(r => parseFloat(r.crashRate))
      gameEvents.emit("history:update", history)
    } catch (e) {
      // silent — history is non-critical
    }
  }

  private initSocket() {

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
    })

    // Betting window opens
    socket.on("/crash-game/roundStarted", ({ data }) => {
      this.store.roundId = data.id

      gameEvents.emit("round:created", { roundId: data.roundId })

      // bettingWindowSeconds drives the "Place your bets" countdown in FlyArea
      gameEvents.emit("round:waiting", { seconds: data.bettingWindowSeconds })

      this.store.setPhase("WAITING")
      this.store.onRoundWaiting()

      this.loadHistory()
    })

    // Betting closed — graph starts
    socket.on("/crash-game/roundBettingOnHold", () => {
      this.store.setPhase("FLYING")
      this.store.startFlying()
      gameEvents.emit("round:start")
    })

    // Multiplier ticks (~100 ms interval)
    socket.on("/crash-game/graphTimer", ({ data }) => {
      if (data.runningStatus) {
        const time = data.elapsedMs / 1000  // convert ms → seconds for FlyArea
        const multiplier = data.multiplier

        this.store.updateMultiplier(multiplier)
        gameEvents.emit("plane:update", { time, multiplier })
      } else {
        // Last tick — server signals crash via runningStatus: false
        const crashRate = data.multiplier

        this.store.crashPoint = crashRate
        this.store.setPhase("CRASHED")
        this.store.crash()

        gameEvents.emit("plane:crash", { crashRate })
      }
    })

    // Round ended — authoritative crash rate + provably fair data
    socket.on("/crash-game/roundStopped", () => {
      this.loadHistory()
    })

    // Countdown between rounds (after stopped, before next roundStarted)
    socket.on("/crash-game/waitingTimer", ({ data }) => {
      const seconds = data.seconds + (data.secondTenths ?? 0) / 10
      gameEvents.emit("round:countdown", { seconds })
    })

    // Active bets list broadcast
    socket.on("/crash-game/placedBets", ({ data }) => {
      gameEvents.emit("bets:update", data.bets)
    })
  }
}
