import { load, dump } from "js-yaml"
import { CompositePath } from "./CompositePath"
import { readFile } from "../../fs_promise"
import { CompositeFile } from "./"

export interface FileLoaderParams {
  discriminator: string
  parent: string
  path: CompositePath
}

export class FileLoader {
  constructor (private readonly params: FileLoaderParams) { }
  path = this.params.path

  async run (): Promise<CompositeFile[]> {
    const text = await readFile(this.path.raw)
    const content = await load(text)
    Object.assign(
      content.definition.properties,
      this.discriminator,
    )
    const file: CompositeFile = {
      toYaml: dump({ [this.path.toQualified]: content.definition }),
      location: this.path.toRelative,
    }
    return [file]
  }

  private get discriminator () {
    return {
      [this.params.discriminator]: {
        type: "string",
        description: `discriminator of ${this.params.parent}`,
        example: this.path.asDiscriminator,
      },
    }
  }
}
