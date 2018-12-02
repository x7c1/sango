import { expect } from "chai"
import { load } from "js-yaml"
import { readFile } from "sango/fs_promise"

describe("generated error attributes", () => {

  const read = async () => {
    // run generator by this line
    await require("./index").main
    const path = "./projects/example-errors/dist/index.gen.yaml"
    const text = await readFile(path)
    return load(text)
  }

  it("should contain composite parent", async () => {
    const root = await read()
    const schemas = root["components"]["schemas"]

    expect(schemas["errors.ErrorAttributes"]).to.deep.equal({
      oneOf: [
        { "$ref": "#/components/schemas/errors.foo.CamelCaseName" },
        { "$ref": "#/components/schemas/errors.foo.bar.snake_case_name" },
        { "$ref": "#/components/schemas/errors.invalid-foo-id" },
      ],
      discriminator: {
        propertyName: "errorKey",
        mapping: {
          "foo/CamelCaseName":
            "#/components/schemas/errors.foo.CamelCaseName",
          "foo/bar/snake_case_name":
            "#/components/schemas/errors.foo.bar.snake_case_name",
          "invalid-foo-id":
            "#/components/schemas/errors.invalid-foo-id",
        },
      },
    })
  })

  it("should contain composite children", async () => {
    const root = await read()
    const schemas = root["components"]["schemas"]

    expect(schemas["errors.foo.CamelCaseName"]).to.deep.equal({
      type: "object",
      required: [ "max", "min" ],
      properties:        {
        max: { type: "number", description: "max length" },
        min: { type: "number", description: "min length" },
        errorKey: {
          type: "string",
          description: "discriminator of ErrorAttributes",
          example: "foo/CamelCaseName",
        },
      },
    })
    expect(schemas["errors.invalid-foo-id"]).to.deep.equal({
      type: "object",
      required: [ "bar" ],
      properties: {
        bar: {
          type: "string",
          description: "explanation for this bar field." },
        errorKey: {
          type: "string",
          description: "discriminator of ErrorAttributes",
          example: "invalid-foo-id" },
      },
    })
    expect(schemas["errors.foo.bar.snake_case_name"]).to.deep.equal({
      type: "object",
      required: [ "max", "min" ],
      properties:        {
        max: { type: "number", description: "max length" },
        min: { type: "number", description: "min length" },
        errorKey: {
          type: "string",
          description: "discriminator of ErrorAttributes",
          example: "foo/bar/snake_case_name" },
      },
    })
  })

})
