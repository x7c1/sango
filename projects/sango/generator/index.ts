import * as path from "path"
import { Appender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"
import { Logger } from "../logger"
import { attempt } from "../attempt"
import { PostAssertable } from "./PostAssertable"

export interface Generator<A> {
  (): Promise<A>
}

interface WriterParams {
  traverser: Traverser
  outputPath: string
}

interface ComposerParams {
  templatePath: string
  outputPath: string
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
        outputPath: path.resolve(basePath, outputPath),
        logger,
      })
      await appender.clear()
      await appender.appendAll(contents)
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
      logger.info("[generator#compose] done.")
      return yaml
    })
  },
  output: (outputPath: string) => async (yaml: string): Promise<void> => {
    const appender = Appender({
      outputPath: path.resolve(basePath, outputPath),
      logger,
    })
    await appender.clear()
    await appender.append(yaml)
  },
})