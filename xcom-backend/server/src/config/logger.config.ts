import { path } from 'app-root-path'
import { createLogger, format, transports } from 'winston'
import { LOGS_FOLDER } from './env.config'

const options = {
    info: {
        name: 'info-file',
        level: 'debug',
        filename: `${path}/${LOGS_FOLDER}debug.log`,
        handleExceptions: true,
        maxsize: 104857600,
        format: format.combine(format.timestamp({ alias: '@timestamp' }), format.json())
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: format.combine(format.colorize(), format.timestamp(), format.simple())
    }
}

// IF DRYRUN ENABLED LOG CONFIGURATION IS EMPTY
const logger = createLogger({
    transports: [new transports.File(options.info), new transports.Console(options.console)],
    exitOnError: false
})

export default logger
