import { Logger } from "./"
import * as winston from "winston"
import * as DailyRotateFile from "winston-daily-rotate-file"

const createLogger = (filename: string) => winston.createLogger({
  format: winston.format.cli(),
  transports: [
    new DailyRotateFile({
      filename,
      datePattern: "YYYY-MM-DD",
      maxFiles: 5,
    }),
  ],
})

interface FileLoggerParams {
  filename: string
}

export const FileLogger = ({ filename }: FileLoggerParams): Logger => {
  const logger = createLogger(filename)
  return {
    info: message => {
      logger.info(message)
    },
    error: (message, error) => {
      logger.error(message, error)
    },
  }
}
