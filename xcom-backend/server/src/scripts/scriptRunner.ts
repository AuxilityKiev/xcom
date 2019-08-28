import 'reflect-metadata'
import { logError, logInfo, Severity } from '../common/Logger'
import pipes from './pipes'

const runScript = async (name: string) => {
    const script = (await import(`./${name}`)).default
    return script()
}

const pipeToPlan = (pipe: Array<string | string[]>): Array<() => Promise<any>> => {
    return pipe.map((it: any) => {
        if (isPipe(it)) {
            // chain sequentially
            return pipeToPlan(pipes[it]).reduce((prev, cur) => () => prev().then(() => cur()))
        }
        if (Array.isArray(it)) {
            // unwrap and run in parallel
            return () => Promise.all(pipeToPlan(it).map((fun: () => Promise<any>) => fun()))
        }
        if (typeof it === 'string') {
            return () => {
                const t = process.hrtime()
                const script = it
                logInfo(`started script: ${it}`, { context: __filename, script })
                return runScript(it).then(
                    result => {
                        const time = process.hrtime(t)[0]
                        logInfo(`finished script: ${it} in ${time} seconds`, {
                            context: __filename,
                            time,
                            result,
                            script
                        })
                        return result
                    },
                    err => {
                        const time = process.hrtime(t)[0]
                        logError(
                            `failed script: ${it} in ${time} seconds`,
                            {
                                context: __filename,
                                time,
                                cause: err,
                                script
                            },
                            Severity.HIGH
                        )
                        return Promise.reject(err)
                    }
                )
            }
        }
        return () => Promise.reject(new Error(`unknown pipe el ${it}`))
    })
}

const isPipe = (name: string): boolean => {
    return Object.keys(pipes).includes(name)
}

export const run = async (pipe: Array<string | string[]>) => {
    const plan = pipeToPlan(pipe)
    for (const step of plan) {
        await step()
    }
}
