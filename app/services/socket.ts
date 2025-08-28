import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { Server, ServerOptions } from 'socket.io'

class Websocket {
  private booted = false

  io!: Server

  boot() {
    if (this.booted) return

    this.booted = true

    const rootServer = server.getNodeServer()
    const socketConfig = app.config.get<ServerOptions>('socket')

    this.io = new Server(rootServer, socketConfig)
  }
}

export type SocketMiddleware = Parameters<Websocket['io']['use']>[0]

export default new Websocket()
