import { basename, join } from "path"
import { readdir, stat } from "../../fs_promise"

class CompositeFile {
}

const loadFile = async (path: string): Promise<CompositeFile> => {
  // todo: load file from $path and generate CompositeFile
  console.log("loadFile", path)
  return new CompositeFile()
}

const toComposite = (dir: string) => async (file: string): Promise<CompositeFile[]> => {
  const path = join(dir, file)
  const stats = await stat(path)
  return stats.isDirectory() ? loadDirectory(path) : [ await loadFile(path) ]
}

const loadDirectory = async (dir: string): Promise<CompositeFile[]> => {
  const files = await readdir(dir)
  const promises = files.map(toComposite(dir))
  const composites: CompositeFile[][] = await Promise.all(promises)
  return composites.reduce((as, bs) => as.concat(bs), [])
}

export const loadFiles = async (dir: string): Promise<CompositeFile[]> => {
  const root = basename(dir)
  const files = await loadDirectory(dir)
  console.log(`root: ${root}`, dir)
  console.log(files)
  return []
}
