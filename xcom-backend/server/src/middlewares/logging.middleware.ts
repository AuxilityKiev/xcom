import { Context } from 'koa'
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { log, LogLevel } from '../common/Logger'

let i: number = 0

@Middleware({ type: 'before' })
export class LoggingMiddleware implements KoaMiddlewareInterface {
    public async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        log(
            `incoming request`,
            {
                number: i,
                method: context.method,
                url: context.url,
                body: context.request.body,
                ip: context.ip,
                headers: context.request.headers
            },
            LogLevel.INFO
        )
        try {
            return await next()
        } finally {
            log(
                `outgoing response`,
                {
                    number: i,
                    method: context.method,
                    statusCode: context.response.status
                },
                LogLevel.INFO
            )
            i++
        }
    }
}
