import * as path from "path"
import { readdir, stat } from "../fs_promise"
import { FragmentsLoader, setupLoader } from "./index"
import { Logger } from "../logger"
import { TextTraverser } from "./TextTraverser"

// rf. https://stackoverflow.com/a/46700791
const nonEmpty = <A> (value: A | null | undefined): value is A => {
  return value !== null && value !== undefined
}

const toDirectoryPath = (dir: string) => async (file: string): Promise<string | null> => {
  const path = dir + "/" + file
  const stats = await stat(path)
  return stats.isDirectory() ? path : null
}

const directoriesOf = async (dir: string): Promise<string[]> => {
  const files = await readdir(dir)
  const dirs = files.map(toDirectoryPath(dir))
  return (await Promise.all(dirs)).filter(nonEmpty)
}

export interface Traverser {
  (): Promise<FragmentsLoader>
}

interface TraverserContext {
  logger: Logger
  basePath: string
}

export const setupTraverser = ({ logger, basePath }: TraverserContext) => {
  const { fromTexts, fromYamls } = setupLoader({ logger })
  return ({
    traverseTexts (...dirs: string[]): TextTraverser {
      return dirs
        .map(_ => path.join(basePath, _))
        .map(_ => TextTraverser(() => fromTexts(_)))
        .reduce((t1, t2) => t1.append(t2))
    },
    traverseYamls (dir: string): Traverser {
      return () => {
        const merge = (loaders: FragmentsLoader[]) => loaders.reduce(
          (a, b) => a.appendLoader(b),
        )
        const traverseAll = (dirs: string[]) => Promise.all(
          dirs.map(fromYamls),
        )
        return directoriesOf(path.join(basePath, dir))
          .then(traverseAll)
          .then(merge)
      }
    },
  })
}
