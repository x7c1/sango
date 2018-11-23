
export interface Logger {
  info (message: string): void
  error (message: string, error: any): void
}

export const ConsoleLogger: Logger = {
  info: message => {
    console.info(message)
  },
  error: (message, error) => {
    console.error(message, error)
  },
}
