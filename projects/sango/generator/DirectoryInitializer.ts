import { mkdir, readdir, unlink } from "../fs_promise"
import { join } from "path"
import * as fs from "fs"
import { Logger } from "../logger"

export const DirectoryInitializer = (dir: string, logger: Logger) => {
  const info = (message: string) => logger.info(`[DirectoryInitializer] ${message}`)
  return {
    async ensureDirectory () {
      if (fs.existsSync(dir)) {
        return
      }
      info(`ensureDirectory: ${dir}`)
      await mkdir(dir, { recursive: true })
    },

    async clearFiles () {
      const files = await readdir(dir)
      const paths = files.map(_ => join(dir, _))

      info(`clearFiles: ${dir}`)
      await Promise.all(paths.map(unlink))
    },
  }
}
