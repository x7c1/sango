import { Logger } from "./"

export const FileLogger: Logger = {
  info: message => {
    // todo:
    console.info(message)
  },
  error: (message, error) => {
    // todo:
    console.error(message, error)
  },
}
