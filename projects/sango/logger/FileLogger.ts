import { Logger } from "./"
import { createLogger } from "winston"
import { format } from "logform"
import * as DailyRotateFile from "winston-daily-rotate-file"

const create = (filename: string) => createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
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
  const logger = create(filename)
  return {
    info: message => {
      logger.info(message)
    },
    error: (message, error) => {
      logger.error(message, error)
    },
  }
}
