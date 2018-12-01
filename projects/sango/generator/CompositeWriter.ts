import * as fs from "fs"
import { join } from "path"
import { Composite, CompositeFile } from "./composite"
import { Logger } from "../logger"
import { mkdir, readdir, unlink, writeFile } from "../fs_promise"

interface CompositeWriter {
  replaceFiles (composite: Composite): Promise<void>
}

interface ParentFile {
  toYaml: string
  path: {
    toQualifiedFileName: string,
  }
}

class CompositeWriterImpl implements CompositeWriter {
  constructor (
    private readonly outputDir: string,
    private readonly logger: Logger) { }

  async replaceFiles (composite: Composite): Promise<void> {
    await this.ensureDirectory()
    await this.clearFiles()
    await this.writeParentFile(composite.parentFile)
    await Promise.all(composite.childFiles.map(this.writeChildFile))
  }

  private async ensureDirectory () {
    if (fs.existsSync(this.outputDir)) {
      return
    }
    this.logger.info(`[CompositeWriterImpl] ensureDirectory: ${this.outputDir}`)
    await mkdir(this.outputDir, { recursive: true })
  }

  private async clearFiles () {
    const files = await readdir(this.outputDir)
    const paths = files.map(_ => join(this.outputDir, _))

    this.logger.info(`[CompositeWriterImpl] clearFiles: ${this.outputDir}`)
    await Promise.all(paths.map(unlink))
  }

  private writeParentFile = async (file: ParentFile): Promise<void> => {
    const path = join(this.outputDir, file.path.toQualifiedFileName)

    this.logger.info(`[CompositeWriterImpl] write: ${file.path.toQualifiedFileName}`)
    await writeFile(path, file.toYaml)
  }

  private writeChildFile = async (file: CompositeFile) => {
    const path = join(this.outputDir, file.path.toQualifiedFileName)
    const head = `# ${file.path.raw} \n`

    this.logger.info(`[CompositeWriterImpl] write: ${file.path.toQualifiedFileName}`)
    await writeFile(path, head + file.toYaml)
  }
}

interface CompositeWriterParams {
  outputDir: string
  logger: Logger
}

export const CompositeWriter = (params: CompositeWriterParams): CompositeWriter => {
  return new CompositeWriterImpl(params.outputDir, params.logger)
}
