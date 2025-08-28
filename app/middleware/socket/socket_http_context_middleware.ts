import { ServerResponse } from 'node:http'
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import SessionMiddleware from '@adonisjs/session/session_middleware'

import type { SocketMiddleware } from '#services/socket'

export default async function SocketHttpContextMiddleware(
  socket: Parameters<SocketMiddleware>[0],
  next: Parameters<SocketMiddleware>[1]
) {
  const response = new ServerResponse(socket.request)

  const context = server.createHttpContext(
    server.createRequest(socket.request, response),
    server.createResponse(socket.request, response),
    app.container.createResolver()
  )

  const session = await app.container.make(SessionMiddleware)
  await session.handle(context, async () => response)

  const auth = await app.container.make('auth.manager')
  context.auth = auth.createAuthenticator(context)

  socket.context = context

  next()
}
