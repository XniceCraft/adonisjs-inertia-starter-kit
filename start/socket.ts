import { Socket as SocketClient } from 'socket.io'
import app from '@adonisjs/core/services/app'
import Socket from '#services/socket'
import SocketHttpContextMiddleware from '#middleware/socket/socket_http_context_middleware'
import SocketAuthMiddleware from '#middleware/socket/socket_auth_middleware'

async function onSocketConnected(socket: SocketClient) {
  const io = Socket.io
}

app.ready(() => {
  Socket.boot()
  Socket.io.use(SocketHttpContextMiddleware).use(SocketAuthMiddleware({ guards: ['web'] }))
  Socket.io?.on('connection', onSocketConnected)
})
