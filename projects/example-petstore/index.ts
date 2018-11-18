import { setupTraverser } from "moccasin/loader/traverse"
import { setupGenerator, Runner } from "moccasin/generator"
import { ConsoleLogger } from "moccasin/logger"

const context = {
  logger: ConsoleLogger,
  basePath: "./projects/example-petstore",
}
const { writeYaml, composeYaml } = setupGenerator(context)
const { traverseTexts, traverseYamls } = setupTraverser(context)

Runner
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
