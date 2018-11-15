import { createAppender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"

interface Generator {
  (): Promise<void>
}

interface GeneratorParams {
  outputPath: string
  traverser: Traverser
}

export const createGenerator =
  ({ outputPath, traverser }: GeneratorParams): Generator => () => {
    const appender = createAppender(outputPath)
    return appender.clear().
      then(traverser).
      then(loader => loader.loadContents()).
      then(contents => appender.appendAll(contents))
  }

const outputTo = (outputPath: string) => async (yaml: string) => {
  const appender = createAppender(outputPath)
  await appender.clear()
  await appender.append(yaml)
  console.log("[output.js] generated:", yaml)
}

interface ResolverParams {
  outputPath: string
  templatePath: string
  generators: Generator[]
}

export const toYaml =
  async ({ outputPath, generators, templatePath }: ResolverParams): Promise<void> => {
    const generate = generators.reduce((f, g) => () => f().then(g))
    return generate()
      .then(() => resolveYamlRef(templatePath))
      .then(outputTo(outputPath))
      .catch(err => {
        console.error("[output.js] unexpected error", err)
        process.exit(1)
      })
  }
