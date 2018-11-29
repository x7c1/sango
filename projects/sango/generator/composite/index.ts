import { FileLoaderParams } from "./FileLoader"
import { loadFiles } from "./loadFiles"

export interface CompositeFile {
  toYaml: string
  location: string
}

export interface Composite {
  parentFile: CompositeFile
  childFiles: CompositeFile[]
}

export const composeFiles =
  async (params: FileLoaderParams): Promise<Composite> => {
    const childFiles = await loadFiles(params)
    const parentFile = {
      location: "",
      toYaml: "",
    }
    return {
      parentFile,
      childFiles,
    }
  }
