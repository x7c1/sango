import { createAppender } from "../appender"
import { Traverser } from "../loader/traverse"
import { resolveYamlRef } from "./resolve"

interface Generator {
  (): Promise<void>
}

interface GeneratorParams {
  traverser: Traverser
  outputPath: string
}

export const createGenerator =
  ({ outputPath, traverser }: GeneratorParams): Generator => async () => {
    const appender = createAppender(outputPath)
    await appender.clear()

    const loader = await traverser()
    const contents = await loader.loadContents()
    await appender.appendAll(contents)
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

export const writeYaml =
  ({ templatePath, outputPath }: WriterParams): Generator => async () => {
    const yaml = await resolveYamlRef(templatePath)
    const appender = createAppender(outputPath)
    await appender.clear()
    await appender.append(yaml)
    console.log("[generator] done:", yaml)
  }
