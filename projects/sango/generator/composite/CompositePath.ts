import { join } from "path"

export interface CompositePath {
  raw: string
  toQualified: string
  toRelative: string
  append (file: string): CompositePath
}

class CompositePathImpl implements CompositePath {
  constructor (
    private readonly basePath: string,
    private readonly sourceDir: string,
    private readonly files: string[] = [],
  ) {}

  raw: string = join(this.basePath, this.sourceDir, ...this.files)

  get toQualified () {
    const parent = join(this.sourceDir).replace(/[/]/g, ".")
    const location = [parent, ...this.files].join(".")

    // remove file extension
    return location.replace(/\.[^/.]+$/, "")
  }

  get toRelative () {
    return join(this.sourceDir, ...this.files)
  }

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
