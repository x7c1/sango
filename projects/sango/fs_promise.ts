import * as fs from "fs"
import { promisify } from "util"

export const readdir = (dir: string): Promise<string[]> => {
  return promisify(fs.readdir)(dir)
}

export const readFile = (path: string): Promise<string> => {
  return promisify(fs.readFile)(path, "utf8")
}

export const stat = (path: string): Promise<fs.Stats> => {
  return promisify(fs.stat)(path)
}

export const appendFile = (file: string, content: string): Promise<void> => {
  return promisify(fs.appendFile)(file, content)
}

export const writeFile = (file: string, content: string): Promise<void> => {
  return promisify(fs.writeFile)(file, content)
}

export const mkdir = (dir: string, options: fs.MakeDirectoryOptions) => {
  return promisify(fs.mkdir)(dir, options)
}

export const unlink = (file: string) => {
  return promisify(fs.unlink)(file)
}
