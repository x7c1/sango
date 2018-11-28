import { readdir, stat } from "../../fs_promise"
import { FileLoader, FileLoaderParams } from "./FileLoader"

export interface CompositeFile {
  toYaml: string
  location: string
}

const setupLoader = async (params: FileLoaderParams) => {
  const stats = await stat(params.path.raw)
  return stats.isDirectory() ?
    new DirectoryLoader(params) :
    new FileLoader(params)
}

class DirectoryLoader {
  constructor (private readonly params: FileLoaderParams) {}
  path = this.params.path

  async run (): Promise<CompositeFile[]> {
    const files = await readdir(this.path.raw)
    const promises = files.map(this.toComposite)
    const composites: CompositeFile[][] = await Promise.all(promises)
    return composites.reduce((as, bs) => as.concat(bs), [])
  }

  private toComposite = async (file: string): Promise<CompositeFile[]> => {
    const loader = await setupLoader({
      discriminator: this.params.discriminator,
      parent: this.params.parent,
      path: this.path.append(file),
    })
    return loader.run()
  }
}

export const loadFiles =
  async (params: FileLoaderParams): Promise<CompositeFile[]> => {
    const loader = await setupLoader(params)
    return loader.run()
  }
