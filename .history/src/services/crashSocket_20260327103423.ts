import { io, Socket } from "socket.io-client"

// const BASE_URL: string = import.meta.env.VITE_SOCKET_URL;
const BASE_URL: string = https://cron-dev.grailbet.com';

export const socket: Socket = io(`${BASE_URL}/crash-game`, {
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
