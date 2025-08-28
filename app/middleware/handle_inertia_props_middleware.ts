import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class HandleInertiaPropsMiddleware {
  async handle({ session, inertia }: HttpContext, next: NextFn) {
    inertia.share({
      errors: session.flashMessages.get('errors'),
      success: session.flashMessages.get('success'),
    })

    await next()
  }
}
