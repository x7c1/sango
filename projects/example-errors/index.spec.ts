import { expect } from "chai"
import { load } from "js-yaml"
import { readFile } from "sango/fs_promise"

describe("generated OpenAPI yaml", () => {

  const read = async () => {
    // run generator by this line
    await require("./index").main
    const path = "./projects/example-errors/dist/index.gen.yaml"
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
