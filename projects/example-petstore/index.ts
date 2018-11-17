import { setupTraverser } from "moccasin/loader/traverse"
import { setupGenerator, Runner } from "moccasin/generator"
import { ConsoleLogger, Logger } from "moccasin/logger"

process.chdir("./projects/example-petstore")

const logger: Logger = ConsoleLogger
const { writeYaml, composeYaml } = setupGenerator({ logger })
const { traverseTexts, traverseYamls } = setupTraverser({ logger })

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
    logger.error("[index.ts] unexpected error", err)
    process.exit(1)
  })
