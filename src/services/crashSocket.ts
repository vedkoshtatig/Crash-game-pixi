import { io, Socket } from "socket.io-client"
import { getAuthToken } from "./getAuthtoken"

const BASE_URL: string = import.meta.env.VITE_SOCKET_URL;
const token = getAuthToken();

export const socket: Socket = io(`${BASE_URL}/crash-game`, {
  path: "/api/socket",
  transports: ["websocket"],
  auth: { token },
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
})
