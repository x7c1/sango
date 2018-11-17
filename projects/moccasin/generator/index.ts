import { Appender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"
import { Logger } from "../logger"

interface Generator {
  (): Promise<void>
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
}

export const Runner = {
  run: (generators: Generator[]): Promise<void> => {
    const generate = generators.reduce((f, g) => () => f().then(g))
    return generate()
  },
}

export const setupGenerator = ({ logger }: GeneratorContext) => ({

  writeYaml ({ outputPath, traverser }: WriterParams): Generator {
    return async () => {
      const appender = Appender({ outputPath, logger })
      await appender.clear()

      const loader = await traverser()
      const contents = await loader.loadContents()
      await appender.appendAll(contents)
    }
  },

  composeYaml ({ templatePath, outputPath }: ComposerParams): Generator {
    return async () => {
      const yaml = await resolveYamlRef(templatePath)
      const appender = Appender({ outputPath, logger })
      await appender.clear()
      await appender.append(yaml)

      logger.info("[generator] done: " + yaml)
    }
  },
})
