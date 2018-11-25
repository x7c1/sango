import { ValidatorError } from "./ValidatorError"
import { default as OpenApiSchemaValidator } from "openapi-schema-validator"
import { load } from "js-yaml"

const validator = new OpenApiSchemaValidator({
  version: 3,
})

export const validate = (yamlText: string): void => {
  const json = load(yamlText)
  const result = validator.validate(json)
  if (result.errors.length > 0) {
    // indent with 2 spaces
    const message = JSON.stringify(result.errors, null, 2)
    throw new ValidatorError(message)
  }
}
