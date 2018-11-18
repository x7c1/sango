
interface AttemptParams<A> {
  onStart: () => void
  onProcess: () => Promise<A>
  onFinish: () => void
}

export const attempt =
  <A> ({ onStart, onProcess, onFinish }: AttemptParams<A>): Promise<A> => {
    onStart()
    return onProcess().then(result => {
      onFinish()
      return result
    }).catch(e => {
      onFinish()
      throw e
    })
  }
