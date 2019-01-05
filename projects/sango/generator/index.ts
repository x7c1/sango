import { dirname, join } from "path"
import { Appender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"
import { Logger } from "../logger"
import { attempt } from "../attempt"
import { PostAssertable } from "./PostAssertable"
import { composeFiles } from "./composite"
import { CompositePath } from "./composite/CompositePath"
import { CompositeWriter } from "./CompositeWriter"
import { DirectoryInitializer } from "./DirectoryInitializer"

export interface Generator<A> {
  (): Promise<A>
}

interface WriterParams {
  traverser: Traverser
  outputPath: string
}

interface ComposerParams {
  outputDir: string
  sourceDir: string
  parent: string
  discriminator: string
}

interface GeneratorContext {
  logger: Logger
  basePath: string
}

export const Runner = {
  run: (generators: Generator<void>[]): Promise<void> => {
    const generate = generators.reduce((f, g) => () => f().then(g))
    return generate()
  },
}

export const setupGenerator = ({ logger, basePath }: GeneratorContext) => ({
  write ({ outputPath, traverser }: WriterParams): Generator<void> {
    return async () => {
      const loader = await traverser()
      const contents = await loader.loadContents()
      const appender = Appender({
        outputPath: join(basePath, outputPath),
        logger,
      })
      await appender.clear()
      await appender.appendAll(contents)
    }
  },
  compose (params: ComposerParams): Generator<void> {
    const compositePath = CompositePath({
      basePath,
      sourceDir: params.sourceDir,
    })
    return async () => {
      const composite = await composeFiles({
        path: compositePath,
        discriminator: params.discriminator,
        parent: params.parent,
        sourceDir: params.sourceDir,
      })
      const writer = CompositeWriter({
        outputDir: join(basePath, params.outputDir),
        logger,
      })
      await writer.replaceFiles(composite)
      logger.info("[generator#compose] done.")
    }
  },
  resolve (templatePath: string): Generator<string> & PostAssertable<string> {
    return PostAssertable(async () => {
      const original = process.cwd()
      const yaml = await attempt({
        onStart: () => process.chdir(basePath),
        onProcess: () => resolveYamlRef(templatePath),
        onFinish: () => process.chdir(original),
      })
      logger.info("[generator#resolve] done.")
      return yaml
    })
  },
  output: (outputPath: string) => async (yaml: string): Promise<void> => {
    const path = join(basePath, outputPath)
    const initializer = DirectoryInitializer(dirname(path), logger)
    await initializer.ensureDirectory()

    const appender = Appender({
      outputPath: path,
      logger,
    })
    await appender.clear()
    await appender.append(yaml)
  },
})
