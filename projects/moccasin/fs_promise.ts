import * as fs from "fs"
import { promisify } from "util"

export const readdir = (dir: string): Promise<string[]> => {
  return promisify(fs.readdir)(dir)
}
