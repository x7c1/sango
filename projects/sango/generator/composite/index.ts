import { dump } from "js-yaml"
import { join } from "path"
import { FileLoaderParams } from "./FileLoader"
import { loadFiles } from "./loadFiles"
import { CompositePath } from "./CompositePath"

export interface CompositeFile {
  toYaml: string
  path: CompositePath
}

export interface Composite {
  parentFile: {
    toYaml: string
    path: {
      toQualifiedFileName: string,
    },
  }
  childFiles: CompositeFile[]
}

export interface ComposeParams extends FileLoaderParams {
  sourceDir: string
}

const schemaOf = (path: CompositePath) =>
  `#/components/schemas/${path.toQualified}`

export const composeFiles =
  async (params: ComposeParams): Promise<Composite> => {
    const childFiles = await loadFiles(params)
    const mapping = childFiles.reduce(
      (map, file) => ({
        ...map,
        [file.path.asDiscriminator]: schemaOf(file.path),
      }),
      {},
    )
    const oneOf = childFiles.map(file => ({
      $ref: schemaOf(file.path),
    }))
    const discriminator = {
      propertyName: params.discriminator,
      mapping,
    }
    const toQualified = join(params.sourceDir, params.parent).replace(/[/]/, ".")
    const toQualifiedFileName = `${toQualified}.yaml`

    const parentFile = {
      toYaml: dump({
        [toQualified] : { oneOf, discriminator },
      }),
      path: {
        toQualifiedFileName,
      },
    }
    return { parentFile, childFiles }
  }
