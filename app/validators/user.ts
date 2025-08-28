import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().minLength(1),
    password: vine.string().minLength(1),
    rememberMe: vine.boolean().optional(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255),
    email: vine
      .string()
      .email()
      .minLength(1)
      .maxLength(255)
      .unique(async (db, value) => {
        const row = await db.from('users').where('email', value).first()
        return row === null
      }),
    password: vine.string().minLength(8),
  })
)
