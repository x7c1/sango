import { join } from "path"

export interface CompositePath {
  raw: string
  append (file: string): CompositePath
}

class CompositePathImpl implements CompositePath {
  constructor (
    private readonly basePath: string,
    private readonly sourceDir: string,
    private readonly files: string[] = [],
  ) {}

  raw: string = join(this.basePath, this.sourceDir, ...this.files)

  append (file: string) {
    return new CompositePathImpl(
      this.basePath,
      this.sourceDir,
      this.files.concat(file),
    )
  }
}

export const CompositePath = (args: { basePath: string, sourceDir: string}) => {
  return new CompositePathImpl(args.basePath, args.sourceDir)
}
