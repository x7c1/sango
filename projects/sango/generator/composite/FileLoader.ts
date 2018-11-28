import { load, dump } from "js-yaml"
import { CompositePath } from "./CompositePath"
import { readFile } from "../../fs_promise"
import { CompositeFile } from "./"

export class FileLoader {
  constructor (private readonly path: CompositePath) {}

  async run (): Promise<CompositeFile[]> {
    const text = await readFile(this.path.raw)
    const content = await load(text)

    Object.assign(content.definition.properties, {
      errorKey: {
        type: "string",
        description: "discriminator of ErrorAttributes",
        example: this.path.discriminator,
      },
    })
    const file: CompositeFile = {
      toYaml: dump({
        [this.path.toQualified]: content.definition,
      }),
      location: this.path.toRelative,
    }
    return [file]
  }
}
