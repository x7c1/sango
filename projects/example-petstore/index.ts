import { setupTraverser, setupGenerator, Runner, FileLogger, validate } from "sango"

export const context = {
  logger: FileLogger({ filename: "logs/example.%DATE%.log" }),
  basePath: "./projects/example-petstore",
}
const { writeFile, resolve, output } = setupGenerator(context)
const { traverseTexts, traverseYamls } = setupTraverser(context)

export const main = Runner
  .run([
    writeFile({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas"),
    }),
    writeFile({
      outputPath: "./paths/index.gen.yaml",
      traverser: traverseYamls("./paths"),
    }),
  ])
  .then(resolve("./index.template.yaml").and(validate))
  .then(output("./dist/index.gen.yaml"))
  .catch(err => {
    console.error("[index.ts] unexpected error:", err)
    process.exit(1)
  })
