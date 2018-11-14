import * as fs from "fs"
import { promisify } from "util"

export const readdir = (dir: string): Promise<string[]> => {
  return promisify(fs.readdir)(dir)
}

export const readFile = (path: string): Promise<string> => {
  return promisify(fs.readFile)(path, "utf8")
}
