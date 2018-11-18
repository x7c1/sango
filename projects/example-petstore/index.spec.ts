import { expect } from "chai"
import { load } from "js-yaml"
import { FileLogger } from "moccasin/logger/FileLogger"
import { setupTraverser } from "moccasin/loader/traverse"
import { readFile } from "moccasin/fs_promise"

const { traverseTexts, traverseYamls } = setupTraverser({
  logger: FileLogger,
  basePath: "./projects/example-petstore",
})

describe("traverseTexts", () => {
  it("concat all texts in a given directory", async () => {
    const loader = await traverseTexts("./components/schemas")()
    const contents = await loader.loadContents()
    const schemas = contents.map(_ => _.dump()).join("")

    expect(schemas).to.include("Error:")
    expect(schemas).to.include("Pet:")
    expect(schemas).to.include("Pets:")
  })
})

describe("traverseYamls", () => {
  it("concat all yamls in a given directory", async () => {
    const loader = await traverseYamls("./paths")()
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

describe("generated OpenAPI yaml", () => {

  const read = async () => {
    // run generator by this line
    require("./index")

    const path = "./projects/example-petstore/dist/index.gen.yaml"
    const text = await readFile(path)
    return load(text)
  }

  it("should contain paths", async () => {
    const root = await read()
    expect(root["paths"]["/pets"]["post"]).to.exist
    expect(root["paths"]["/pets"]["get"]).to.exist
    expect(root["paths"]["/users/{userId}"]["get"]).to.exist
    expect(root["paths"]["/users/{userId}"]["post"]).to.not.exist
  })

  it("should contain components", async () => {
    const root = await read()
    expect(root["components"]["schemas"]["Error"]).to.exist
    expect(root["components"]["schemas"]["Pets"]).to.exist
    expect(root["components"]["schemas"]["Pet"]).to.exist
    expect(root["components"]["schemas"]["User"]).to.exist
  })
})
