import { path } from 'app-root-path'
import { createLogger, format, transports } from 'winston'
import {
    APP_NAME,
    APP_VERSION_CODE,
    APP_VERSION_NAME,
    LOGS_FOLDER, NODE_ENV
} from '../config/env.config'

const options = {
    info: {
        name: 'info-file',
        level: 'debug',
        filename: `/var/log/xcom/${APP_NAME}_.log`,
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

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    VERBOSE = 'verbose'
}

export enum Severity {
    WARNING = 'WARNING',
    MILD = 'MILD',
    HIGH = 'HIGH',
    EXTREME = 'EXTREME'
}

export const log = (message: string, meta?: any, level: LogLevel = LogLevel.DEBUG) => {
    const appInfo = {
        appName: APP_NAME,
        appVersion: APP_VERSION_NAME,
        appVersionCode: APP_VERSION_CODE,
        environment: NODE_ENV
    }
    // @ts-ignore
    logger[level].call(logger, message, { ...appInfo, ...meta })
}

export const logVerbose = (message: string, meta?: any) => log(message, meta, LogLevel.VERBOSE)

export const logDebug = (message: string, meta?: any) => log(message, meta, LogLevel.DEBUG)

export const logInfo = (message: string, meta?: any) => log(message, meta, LogLevel.INFO)

export const logWarn = (message: string, meta?: any, severity: Severity = Severity.WARNING) =>
    log(message, { severity, ...meta }, LogLevel.WARN)

export const logError = (message: string, meta?: any, severity: Severity = Severity.MILD) =>
    log(message, { severity, ...meta }, LogLevel.ERROR)
