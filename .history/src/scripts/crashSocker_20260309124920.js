const { io } = require("socket.io-client")

const GRAIL_BET_URL = 'https://cron-dev.grailbet.com'
const LOACL_URL = 'http://localhost:8080'
const TIG_GAME_ENGINE_URL = 'http://194.37.82.191:8007'

const socket = io(${GRAIL_BET_URL}/crash-game``, {
  path: '/api/socket',
  transports: ['websocket']
})

socket.on('connect', () => {
  console.log('connected', socket.id)
})

socket.onAny((event, data) => {
  if (!event.includes('placedBets')) {
    if (event.includes('graphTimer')) {
      console.log(event, data.data.runningStatus, data.data.secondTenths, data.data.seconds)
      // console.log(event, data);
    } else if (event.includes('waitingTimer')) {
      console.log(event, data.data.runningStatus, data.data.secondTenths, data.data.seconds)
      // console.log(event, data);
    } else {
      console.log(event, data)
    }
  }
})