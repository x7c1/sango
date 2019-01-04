import { join } from "path"
import { Composite, CompositeFile } from "./composite"
import { Logger } from "../logger"
import { writeFile } from "../fs_promise"
import { DirectoryInitializer } from "./DirectoryInitializer"

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
    await this.initializer.ensureDirectory()
    await this.initializer.clearFiles()
    await this.writeParentFile(composite.parentFile)
    await Promise.all(composite.childFiles.map(this.writeChildFile))
  }

  private initializer = DirectoryInitializer(this.outputDir, this.logger)

  private info (message: string) {
    this.logger.info(`[CompositeWriter] ${message}`)
  }

  private writeParentFile = async (file: ParentFile): Promise<void> => {
    const path = join(this.outputDir, file.path.toQualifiedFileName)

    this.info(`writeParentFile: ${path}`)
    await writeFile(path, file.toYaml)
  }

  private writeChildFile = async (file: CompositeFile) => {
    const path = join(this.outputDir, file.path.toQualifiedFileName)
    const head = `# ${file.path.raw} \n`

    this.info(`writeChildFile: ${path}`)
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
