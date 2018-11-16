import { setupTraverser } from "moccasin/loader/traverse"
import { setupGenerator, Runner } from "moccasin/generator"
import { ConsoleLogger, Logger } from "moccasin/logger"

process.chdir("./projects/example-petstore")

const logger: Logger = ConsoleLogger
const { createGenerator, writeYaml } = setupGenerator({ logger })
const { traverseTexts, traverseYamls } = setupTraverser({ logger })

Runner
  .run([
    createGenerator({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas"),
    }),
    createGenerator({
      outputPath: "./paths/index.gen.yaml",
      traverser: traverseYamls("./paths"),
    }),
  ])
  .then(writeYaml({
    outputPath: "./dist/index.gen.yaml",
    templatePath: "./index.template.yaml",
  }))
  .catch(err => {
    logger.error("[index.ts] unexpected error", err)
    process.exit(1)
  })
