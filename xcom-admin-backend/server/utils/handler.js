import Exception from './exception'
import logger from './../config/winston.config'

export default async (ctx, next) => {
  logger.info(`${ctx.method} ${ctx.url}`, {
    body: ctx.request.body,
    ip: ctx.ip
  })
  try {
    return await next()
  } catch (err) {
    if (err instanceof Exception) {
      logger.error(err.toObject())
      ctx.body = err.toObject()
      ctx.status = err.statusCode
    } else {
      logger.error(err.message)
      ctx.body = { message: 'Unexpected error' }
      ctx.status = 500
    }
  }
}
