import { join } from "path"

export interface CompositePath {

  /**
   * ex. "base-path/errors/foo/bar/IllegalParameter.yaml"
   */
  raw: string

  /**
   * ex. "errors/foo/bar/IllegalParameter.yaml"
   */
  toRelative: string

  /**
   * ex. "foo/bar/IllegalParameter"
   */
  asDiscriminator: string

  /**
   * ex. "errors.foo.bar.IllegalParameter"
   */
  toQualified: string

  /**
   * ex. "#/components/schemas/errors.foo.bar.IllegalParameter"
   */
  asSchema: string

  append (file: string): CompositePath
}

class CompositePathImpl implements CompositePath {
  constructor (
    private readonly basePath: string,
    private readonly sourceDir: string,
    private readonly files: string[] = [],
  ) { }

  raw: string = join(this.basePath, this.sourceDir, ...this.files)

  get asDiscriminator () {
    return this.files.join("/").replace(/\.[^/.]+$/, "")
  }

  get toQualified () {
    const parent = join(this.sourceDir).replace(/[/]/g, ".")
    const location = [parent, ...this.files].join(".")

    // remove file extension
    return location.replace(/\.[^/.]+$/, "")
  }

  get toRelative () {
    return join(this.sourceDir, ...this.files)
  }

  get asSchema () {
    return `#/components/schemas/${this.toQualified}`
  }

  append (file: string) {
    return new CompositePathImpl(
      this.basePath,
      this.sourceDir,
      this.files.concat(file),
    )
  }
}

export const CompositePath = (args: { basePath: string, sourceDir: string }) => {
  return new CompositePathImpl(args.basePath, args.sourceDir)
}
