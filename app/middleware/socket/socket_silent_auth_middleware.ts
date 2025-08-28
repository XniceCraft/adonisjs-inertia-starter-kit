import type { SocketMiddleware } from '#services/socket'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SocketSilentAuthMiddleware {
  async handle(socket: Parameters<SocketMiddleware>[0], next: Parameters<SocketMiddleware>[1]) {
    await socket.context.auth.check()

    return next()
  }
}
