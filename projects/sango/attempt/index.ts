
interface AttemptParams<A> {
  onStart: () => void
  onProcess: () => Promise<A>
  onFinish: () => void
}

export const attempt =
  async <A> ({ onStart, onProcess, onFinish }: AttemptParams<A>): Promise<A> => {
    try {
      onStart()
      return await onProcess()
    } finally {
      onFinish()
    }
  }
