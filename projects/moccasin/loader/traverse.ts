import { readdir, stat } from "../fs_promise"
import { FragmentsLoader, fromTexts, fromYamls } from "./loader"

// rf. https://stackoverflow.com/a/46700791
const notEmpty = <A> (value: A | null | undefined): value is A => {
  return value !== null && value !== undefined
}

const directoriesOf = async (dir: string): Promise<string[]> => {
  const collect = (path: string) => {
    return stat(path).then(_ => _.isDirectory() ? path : null)
  }
  const loadFiles = (dir: string) => {
    return readdir(dir).then(_ => _.map(_ => dir + "/" + _))
  }
  return loadFiles(dir)
    .then(_ => Promise.all(_.map(collect)))
    .then(_ => _.filter(notEmpty))
}

export const traverseTexts = (dir: string) => (): Promise<FragmentsLoader> => {
  return fromTexts(dir)
}

export const traverseYamls = (dir: string) => (): Promise<FragmentsLoader> => {
  const merge = (loaders: FragmentsLoader[]) => loaders.reduce(
    (a, b) => a.appendLoader(b),
  )
  const traverseAll = (dirs: string[]) => Promise.all(
    dirs.map(fromYamls),
  )
  return directoriesOf(dir).
    then(traverseAll).
    then(merge)
}
