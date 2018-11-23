import { setupTraverser } from "sango/loader/traverse"
import { setupGenerator, Runner } from "sango/generator"
import { FileLogger } from "sango/logger/FileLogger"

export const logger = FileLogger({
  filename: "logs/example.%DATE%.log",
})

const context = {
  logger,
  basePath: "./projects/example-petstore",
}
const { writeYaml, composeYaml } = setupGenerator(context)
const { traverseTexts, traverseYamls } = setupTraverser(context)

export const main = Runner
  .run([
    writeYaml({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas"),
    }),
    writeYaml({
      outputPath: "./paths/index.gen.yaml",
      traverser: traverseYamls("./paths"),
    }),
  ])
  .then(composeYaml({
    outputPath: "./dist/index.gen.yaml",
    templatePath: "./index.template.yaml",
  }))
  .catch(err => {
    context.logger.error("[index.ts] unexpected error", err)
    process.exit(1)
  })
