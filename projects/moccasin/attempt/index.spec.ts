import { expect } from "chai"
import { attempt } from "./"
import { SampleError } from "./SampleError"

describe("attempt", () => {
  it("should call onFinish when Promise resolved", async () => {
    let [onStarted, onProcessed, onFinished] = [false, false, false]
    const result = await attempt({
      onStart: () => {
        onStarted = true
      },
      onProcess: () => new Promise((resolve, reject) => {
        onProcessed = true
        resolve(123)
      }),
      onFinish: () => {
        onFinished = true
      },
    })
    expect(result).to.eq(123)
    expect(onStarted).to.eq(true)
    expect(onProcessed).to.eq(true)
    expect(onFinished).to.eq(true)
  })

  it("should call onFinish when Promise rejected", async () => {
    let [onStarted, onProcessed, onFinished] = [false, false, false]

    try {
      const result = await attempt({
        onStart: () => {
          onStarted = true
        },
        onProcess: () => new Promise((resolve, reject) => {
          onProcessed = true
          reject("foobar")
        }),
        onFinish: () => {
          onFinished = true
        },
      })
    } catch (e) {
      expect(e).to.eq("foobar")
    }
    expect(onStarted).to.eq(true)
    expect(onProcessed).to.eq(true)
    expect(onFinished).to.eq(true)
  })

  it("should call onFinish when error thrown in Promise", async () => {
    let [onStarted, onProcessed, onFinished] = [false, false, false]

    try {
      const result = await attempt({
        onStart: () => {
          onStarted = true
        },
        onProcess: () => new Promise((resolve, reject) => {
          onProcessed = true
          throw new SampleError("foobar")
        }),
        onFinish: () => {
          onFinished = true
        },
      })
    } catch (e) {
      expect(e.message).to.eq("foobar")
    }
    expect(onStarted).to.eq(true)
    expect(onProcessed).to.eq(true)
    expect(onFinished).to.eq(true)
  })
})
