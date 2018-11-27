import { readdir, stat } from "../../fs_promise"
import { CompositePath } from "./CompositePath"

class CompositeFile {
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

class FileLoader {
  constructor (private readonly path: CompositePath) {}

  async run (): Promise<CompositeFile[]> {
    // todo: load file from $path and generate CompositeFile
    console.log("loadFile at", this.path)
    return [new CompositeFile()]
  }
}

export const loadFiles =
  async (path: CompositePath): Promise<CompositeFile[]> => {
    const loader = await setupLoader(path)
    const files = await loader.run()
    console.log(files)
    return []
  }
