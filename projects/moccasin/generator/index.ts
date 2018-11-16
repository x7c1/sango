import { Appender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"
import { Logger } from "../logger"

interface Generator {
  (): Promise<void>
}

interface GeneratorParams {
  traverser: Traverser
  outputPath: string
}

export const Runner = {
  run: (generators: Generator[]): Promise<void> => {
    const generate = generators.reduce((f, g) => () => f().then(g))
    return generate()
  },
}

interface WriterParams {
  templatePath: string
  outputPath: string
}

interface GeneratorContext {
  logger: Logger
}

export const setupGenerator = ({ logger }: GeneratorContext) => ({

  createGenerator ({ outputPath, traverser }: GeneratorParams): Generator {
    return async () => {
      const appender = Appender({ outputPath, logger })
      await appender.clear()

      const loader = await traverser()
      const contents = await loader.loadContents()
      await appender.appendAll(contents)
    }
  },

  writeYaml ({ templatePath, outputPath }: WriterParams): Generator {
    return async () => {
      const yaml = await resolveYamlRef(templatePath)
      const appender = Appender({ outputPath, logger })
      await appender.clear()
      await appender.append(yaml)

      logger.info("[generator] done: " + yaml)
    }
  },
})
