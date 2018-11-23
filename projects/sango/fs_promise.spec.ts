import { expect } from "chai"
import { readdir, readFile, stat } from "./fs_promise"

describe("readdir", () => {
  it("should return file names", async () => {
    const f1 = await readdir(__dirname)
    expect(f1).to.include("fs_promise.spec.ts")
  })
})

describe("readFile", () => {
  it("should return contents", async () => {
    const f1 = await readFile(__filename)
    expect(f1).to.include('describe("readFile"')
  })
})

describe("stat", () => {
  it("should return contents", async () => {
    const f1 = await stat(__filename)
    expect(f1.isDirectory()).to.eq(false)

    const f2 = await stat(__dirname)
    expect(f2.isDirectory()).to.eq(true)
  })
})
