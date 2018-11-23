import { Generator } from "./"

export interface PostAssertable<A> {
  and (assert: (a: A) => void): Generator<A> & PostAssertable<A>
}

export const PostAssertable = <A> (f: Generator<A>): Generator<A> & PostAssertable<A> =>
  Object.assign(f, {
    and: (assert: (a: A) => void) => PostAssertable(async () => {
      const result = await f()
      assert(result)
      return result
    }),
  })
