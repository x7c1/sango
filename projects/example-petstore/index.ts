import { traverseTexts, traverseYamls } from "moccasin/loader/traverse"
import { createGenerator, output } from "moccasin/generator"

process.chdir("./projects/example-petstore")

output({
  generators: [
    createGenerator({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas"),
    }),
    createGenerator({
      outputPath: "./paths/index.gen.yaml",
      traverser: traverseYamls("./paths"),
    }),
  ],
  templatePath: "./index.template.yaml",
  outputPath: "./dist/index.gen.yaml",
})
