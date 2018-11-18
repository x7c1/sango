import { JsonRefsOptions, ResolvedRefsResults, resolveRefs } from "json-refs"
import { readFileSync } from "fs"
import { dump, load } from "js-yaml"

const options: JsonRefsOptions = {
  loaderOptions: {
    processContent: (result: any, callback: any) => {
      callback(undefined, load(result.text))
    },
  },
}

// tslint:disable-next-line:max-line-length
// https://github.com/whitlockjc/json-refs/blob/master/docs/API.md#module_JsonRefs..ResolvedRefDetails
const extractError = (results: ResolvedRefsResults) => {
  const toError = (ref: any) => {

    // ignore missing error like $ref: '#/components/...'
    const isOpenApiRef = ref.missing && ref.uri.startsWith("#/")
    return !isOpenApiRef && ref.error
  }
  return Object.keys(results.refs).
    map(pointer => {
      return (results as any).refs[pointer]
    }).
    map(toError).
    filter(_ => _)
}

export const resolveYamlRef = (filePath: string): Promise<string> => {
  const root = load(readFileSync(filePath).toString())
  return resolveRefs(root, options).then((results: ResolvedRefsResults) => {
    const errors = extractError(results)
    return errors.length > 0 ?
      Promise.reject(errors) :
      Promise.resolve(dump(results.resolved))
  })
}
