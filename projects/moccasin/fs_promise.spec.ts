import { expect } from "chai"
import { readdir, readFile, stat } from "./fs_promise"

describe("readdir", () => {
  it("should return file names", async () => {
    return readdir(__dirname).then(files => {
      expect(files).to.include("fs_promise.spec.ts")
    })
  })
})

describe("readFile", () => {
  it("should return contents", async () => {
    return readFile(__filename).then(file => {
      expect(file).to.include('describe("readFile"')
    })
  })
})

describe("stat", () => {
  it("should return contents", async () => {
    const p1 = stat(__filename).then(file => {
      expect(file.isDirectory()).to.eq(false)
    })
    const p2 = stat(__dirname).then(file => {
      expect(file.isDirectory()).to.eq(true)
    })
    return Promise.all([p1, p2])
  })
})
