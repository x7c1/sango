import { expect } from "chai"
import { FileLogger } from "moccasin/logger/FileLogger"
import { setupTraverser } from "moccasin/loader/traverse"

const directories = {
  schemas: "./projects/example-petstore/components/schemas",
  paths: "./projects/example-petstore/paths",
}

const { traverseTexts, traverseYamls } = setupTraverser({ logger: FileLogger })

describe("traverseTexts", () => {
  it("concat all texts in a given directory", async () => {
    const loader = await traverseTexts(directories.schemas)()
    const contents = await loader.loadContents()
    const schemas = contents.map(_ => _.dump()).join("")

    expect(schemas).to.include("Error:")
    expect(schemas).to.include("Pet:")
    expect(schemas).to.include("Pets:")
  })
})

describe("traverseYamls", () => {
  it("concat all yamls in a given directory", async () => {
    const loader = await traverseYamls(directories.paths)()
    const contents = await loader.loadContents()
    const paths = contents.map(_ => _.dump()).join("")

    const m1 = paths.match(/\/pets:/g)!
    expect(m1.length).to.eq(1)

    const m2 = paths.match(/\/pets\/{petId}/g)!
    expect(m2.length).to.eq(1)

    const m3 = paths.match(/\/users\/{userId}/g)!
    expect(m3.length).to.eq(1)
  })
})
