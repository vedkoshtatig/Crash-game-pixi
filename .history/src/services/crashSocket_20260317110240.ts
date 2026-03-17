// import { io, Socket } from "socket.io-client"

// const GRAIL_BET_URL: string = "http://194.37.82.191:8007"

// export const socket: Socket = io(`${GRAIL_BET_URL}/crash-game`, {
//   path: "/api/socket",
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// })

// socket.on("connect", () => {
//   console.log("Crash socket connected:", socket.id)
// })

// socket.on("disconnect", (reason) => {
//   console.log(" Crash socket disconnected:", reason)
// })
// // import { io, Socket } from "socket.io-client"

// // const GRAIL_BET_URL: string = "https://cron-dev.grailbet.com"
// // const LOCAL_URL: string = "http://localhost:8080"
// // const TIG_GAME_ENGINE_URL: string = "http://194.37.82.191:8007"

// // export interface TimerData {
// //   runningStatus: boolean
// //   secondTenths: number
// //   seconds: number
// // }

// // export interface SocketPayload {
// //   success?: boolean
// //   data?: TimerData | any
// //   timestamp?: string
// // }

// // export const socket: Socket = io(`${GRAIL_BET_URL}/crash-game`, {
// //   path: "/api/socket",
// //   transports: ["websocket"]
// // })

// // socket.on("connect", () => {
// //   console.log("connected", socket.id)
// // })

// // socket.onAny((event: string, payload: SocketPayload) => {
// //   if (!event.includes("placedBets")) {

// //     if (event.includes("graphTimer")) {
// //       const data = payload.data as TimerData

// //       // console.log(
// //       //   event,
// //       //   data.runningStatus,
// //       //   data.secondTenths,
// //       //   data.seconds
// //       // )

// //     } else if (event.includes("waitingTimer")) {
// //       const data = payload.data as TimerData

// //       // console.log(
// //       //   event,
// //       //   data.runningStatus,
// //       //   data.secondTenths,
// //       //   data.seconds
// //       // )

// //     } else {
// //       console.log(event, payload)
// //     }

// //   }
// // })