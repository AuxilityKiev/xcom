import { Context } from 'koa'
import { RequestError, StatusCodeError } from 'request-promise-native/errors'
import { Action, ActionMetadata, HttpError, KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { logError } from '../common/Logger'
import { NODE_ENV } from '../config/env.config'

@Middleware({ type: 'before' })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {
    private developmentMode = NODE_ENV === 'development'

    public async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            return await next()
        } catch (e) {
            context.body = this.processJsonError(e)
            // set http status
            context.status = e.statusCode || e.httpCode || 500
            logError(e.message, {
                url: context.url,
                ip: context.ip,
                context: __filename,
                requestBody: context.request.body,
                responseBody: context.body,
                status: context.status,
                method: context.method,
                headers: context.request.headers,
                error: e
            })
        }
    }

    private processJsonError(error: any) {
        if (typeof error.toJSON === 'function') {
            return error.toJSON()
        }

        const processedError: any = {}
        if (error instanceof Error) {
            const name = error.name && error.name !== 'Error' ? error.name : error.constructor.name
            processedError.name = name

            if (error.message) {
                processedError.message = error.message
            }
            if (error.stack && this.developmentMode) {
                processedError.stack = error.stack
            }

            if (!this.developmentMode && this.isRequestError(error)) {
                // do not leak outgoing request details
                return processedError
            }

            Object.keys(error)
                .filter(
                    key =>
                        key !== 'stack' &&
                        key !== 'name' &&
                        key !== 'message' &&
                        (!(error instanceof HttpError) || key !== 'httpCode')
                )
                .forEach(key => (processedError[key] = (error as any)[key]))

            return Object.keys(processedError).length > 0 ? processedError : undefined
        }

        return error
    }

    private isRequestError(error: any): boolean {
        return error instanceof StatusCodeError || error instanceof RequestError
    }
}
