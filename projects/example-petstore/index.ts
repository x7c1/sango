import { traverseTexts, traverseYamls } from "moccasin/loader/traverse"
import { createGenerator, Runner, writeYaml } from "moccasin/generator"

process.chdir("./projects/example-petstore")

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
    console.error("[index.ts] unexpected error", err)
    process.exit(1)
  })
