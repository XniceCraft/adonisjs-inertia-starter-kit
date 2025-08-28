import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class RoleCheckMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    roles: Array<string>,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: '/' })
    const user = ctx.auth.user
    if (!user || !roles.includes(user.role)) return ctx.response.forbidden()

    return next()
  }
}
