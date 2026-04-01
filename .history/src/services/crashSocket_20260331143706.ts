import { io, Socket } from "socket.io-client"

const BASE_URL: string = import.meta.env.VITE_SOCKET_URL;
// const GRAIL_BET_URL = 'https://cron-dev.grailbet.com'
export const socket: Socket = io(`http://194.37.82.191:8007//crash-game`, {
  path: "/api/socket",
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
})

// socket.on("connect", () => {
//   // console.log("Crash socket connected:", socket.id)
// })

// socket.on("disconnect", (reason) => {
//   // console.log(" Crash socket disconnected:", reason)
// })
