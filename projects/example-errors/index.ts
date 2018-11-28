import { setupTraverser, setupGenerator, Runner, FileLogger, validate } from "sango"

export const context = {
  logger: FileLogger({ filename: "logs/example.%DATE%.log" }),
  basePath: "./projects/example-errors",
}
const { write, compose, resolve, output } = setupGenerator(context)
const { traverseTexts, traverseYamls } = setupTraverser(context)

export const main = Runner
  .run([
    compose({
      outputDir: "./components/errors.gen",
      sourceDir: "./errors",
      typeParent: "ErrorAttributes",
      typeDiscriminator: "errorKey",
    }),
    write({
      outputPath: "./components/schemas.gen.yaml",
      traverser: traverseTexts("./components/schemas", "./components/errors.gen"),
    }),
    write({
      outputPath: "./components/responses.gen.yaml",
      traverser: traverseTexts("./components/responses"),
    }),
    write({
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
