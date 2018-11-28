import { readdir, stat } from "../../fs_promise"
import { CompositePath } from "./CompositePath"
import { FileLoader } from "./FileLoader"

export interface CompositeFile {
  toYaml: string
  location: string
}

const setupLoader = async (path: CompositePath) => {
  const stats = await stat(path.raw)
  return stats.isDirectory() ?
    new DirectoryLoader(path) :
    new FileLoader(path)
}

class DirectoryLoader {
  constructor (private readonly path: CompositePath) {}

  async run (): Promise<CompositeFile[]> {
    const files = await readdir(this.path.raw)
    const promises = files.map(this.toComposite)
    const composites: CompositeFile[][] = await Promise.all(promises)
    return composites.reduce((as, bs) => as.concat(bs), [])
  }

  private toComposite = async (file: string): Promise<CompositeFile[]> => {
    const path = this.path.append(file)
    const loader = await setupLoader(path)
    return loader.run()
  }
}

export const loadFiles =
  async (path: CompositePath): Promise<CompositeFile[]> => {
    const loader = await setupLoader(path)
    return loader.run()
  }
