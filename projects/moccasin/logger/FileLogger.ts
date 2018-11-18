import { Logger } from "./"
import * as winston from "winston"

const createLogger = (filename: string) => winston.createLogger({
  format: winston.format.cli(),
  transports: [
    new winston.transports.File({ filename }),
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
    error:  (message, error) => {
      logger.error(message)
    },
  }
}
