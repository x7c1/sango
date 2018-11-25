import { Traverser } from "./traverse"

export interface TextTraverser extends Traverser {
  append (traverser: TextTraverser): TextTraverser
}

export const TextTraverser = (traverse1: Traverser): TextTraverser =>
  Object.assign(traverse1, {
    append: (traverse2: TextTraverser) => TextTraverser(async () => {
      const loader1 = await traverse1()
      const loader2 = await traverse2()
      return loader1.appendLoader(loader2)
    }),
  })
