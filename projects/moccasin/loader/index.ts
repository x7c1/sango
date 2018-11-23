import { readdir, readFile } from "../fs_promise"
import { load, dump } from "js-yaml"
import { Logger } from "../logger"

export class FragmentContent {
  constructor (
    private readonly label: string,
    private readonly body: string,
  ) { }

  dump (): string {
    return `#${this.label}\n${this.body}\n`
  }
}

class ContentLoader {
  constructor (
    private readonly dir: string,
    private readonly fileName: string,
    private readonly logger: Logger,
  ) { }

  private readonly path = this.dir + "/" + this.fileName

  loadContent (): Promise<FragmentContent> {
    this.logger.info("[ContentLoader] loadContent: " + this.path)
    return readFile(this.path).then(data =>
      new FragmentContent(this.path, data),
    )
  }
}

const concat = <A> ([xs, ys]: A[][]): A[] => xs.concat(ys)

export abstract class FragmentsLoader {

  appendLoader (loader: FragmentsLoader): FragmentsLoader {
    const toContents = () => [
      this.loadContents(),
      loader.loadContents(),
    ]
    const klass = class extends FragmentsLoader {
      loadContents (): Promise<FragmentContent[]> {
        return Promise.all(toContents()).then(concat)
      }
    }
    return new klass()
  }

  abstract loadContents (): Promise<FragmentContent[]>
}

class FragmentsLoaderForTexts extends FragmentsLoader {
  constructor (private readonly loaders: ContentLoader[]) {
    super()
  }

  loadContents (): Promise<FragmentContent[]> {
    const contents = this.loaders.map(_ => _.loadContent())
    return Promise.all(contents)
  }
}

class FragmentsLoaderForYamls extends FragmentsLoader {
  constructor (
    private readonly dir: string,
    private readonly paths: string[],
  ) {
    super()
  }

  loadContents (): Promise<FragmentContent[]> {
    const loadFiles = this.paths.map(path => {
      return readFile(path).then(load)
    })
    const merge = (xs: any, ys: any) => {
      const callback = (acc: any, key: any) => ({
        ...acc,
        [key]: (key in xs) ? { ...xs[key], ...ys[key] } : ys[key],
      })
      return Object.keys(ys).reduce(callback, xs)
    }
    return Promise.all(loadFiles).
      then(objects => objects.reduce(merge)).
      then(object => new FragmentContent(this.dir, dump(object))).
      then(_ => [_])
  }
}

interface LoaderContext {
  logger: Logger,
}

export const setupLoader = ({ logger }: LoaderContext) => {
  return {
    fromTexts (dir: string): Promise<FragmentsLoader> {
      const toLoaders = (files: string[]) => files.map(fileName => {
        return new ContentLoader(dir, fileName, logger)
      })
      return readdir(dir).
        then(toLoaders).
        then(loaders => new FragmentsLoaderForTexts(loaders))
    },
    fromYamls (dir: string): Promise<FragmentsLoader> {
      return readdir(dir).
        then(files => files.map(_ => dir + "/" + _)).
        then(paths => new FragmentsLoaderForYamls(dir, paths))
    },
  }
}
