import { io, Socket } from "socket.io-client"

const GRAIL_BET_URL: string = "http://14.96.241.250:8007"


export const socket: Socket = io(`${GRAIL_BET_URL}/crash-game`, {
  path: "/api/socket",
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
})

socket.on("connect", () => {
  console.log("Crash socket connected:", socket.id)
})

socket.on("disconnect", (reason) => {
  console.log(" Crash socket disconnected:", reason)
})
